
import { useState } from 'react';
import api from '../services/api.jsx';

function EditarRecado({ recado, onEditar, editando, setEditando }) {
  const [titulo, setTitulo] = useState(recado.titulo);
  const [texto, setTexto] = useState(recado.texto);
  const [anexo, setAnexo] = useState(null);
  const [removerAnexo, setRemoverAnexo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  const nomeAnexoAtual = recado.nome_anexo ||
    (recado.anexo ? recado.anexo.split('/').pop() : null);

  function handleCancelar() {
    setTitulo(recado.titulo);
    setTexto(recado.texto);
    setAnexo(null);
    setRemoverAnexo(false);
    setErro(null);
    setEditando(false);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || !texto.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);

    try {
      const dados = new FormData();

      dados.append('titulo', titulo);
      dados.append('texto', texto);

      if (anexo) {
        dados.append('anexo', anexo);
      } else if (removerAnexo) {
        dados.append('remover_anexo', '1');
      }

      dados.append('_method', 'PUT');

      const { data } = await api.post(
        `/recados/${recado.id}`,
        dados
      );

      onEditar(data.data ?? data);
      setAnexo(null);
      setRemoverAnexo(false);
      setEditando(false);

    } catch (err) {
      console.error('Erro ao editar recado:', err);

      if (err.response?.status === 422) {
        const erros = err.response.data.errors;
        const primeiraMsg = erros
          ? Object.values(erros)[0][0]
          : 'Verifique os dados informados.';

        if (anexo && anexo.size > 2 * 1024 * 1024) {
          setErro(
            'O arquivo selecionado ultrapassa o limite máximo de 2 MB.'
          );
        } else {
          setErro(primeiraMsg);
        }
      } else {
        setErro('Erro ao salvar alterações.');
      }

    } finally {
      setSalvando(false);
    }
  }

  if (!editando) {
    return (
      <button
        className="btn-editar"
        onClick={() => setEditando(true)}
      >
        Editar
      </button>
    );
  }

  return (
    <form onSubmit={handleSalvar} className="editar-recado-form">
      <div>
        <label htmlFor={`titulo-${recado.id}`}>
          Título
        </label>

        <input
          id={`titulo-${recado.id}`}
          type="text"
          value={titulo}
          maxLength={100}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <small>{titulo.length}/100 caracteres</small>
      </div>

      <div>
        <label htmlFor={`texto-${recado.id}`}>
          Descrição
        </label>

        <textarea
          id={`texto-${recado.id}`}
          value={texto}
          maxLength={2000}
          onChange={(e) => setTexto(e.target.value)}
        />

        <small>{texto.length}/2000 caracteres</small>
      </div>

      <div className="anexo-edicao">
        <label>Anexo atual</label>

        <p className="anexo-atual">
          {removerAnexo
            ? 'O anexo será removido ao salvar.'
            : nomeAnexoAtual || 'Nenhum anexo cadastrado.'}
        </p>

        {nomeAnexoAtual && !removerAnexo && (
          <button
            type="button"
            className="btn-excluir"
            onClick={() => {
              setRemoverAnexo(true);
              setAnexo(null);
              setErro(null);
            }}
          >
            Remover anexo
          </button>
        )}

        {removerAnexo && (
          <button
            type="button"
            className="btn-editar"
            onClick={() => setRemoverAnexo(false)}
          >
            Manter anexo atual
          </button>
        )}

        {!removerAnexo && (
          <>
            <label htmlFor={`anexo-${recado.id}`}>
              Selecionar novo anexo (opcional)
            </label>

            <input
              id={`anexo-${recado.id}`}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                setAnexo(e.target.files[0] || null);
                setErro(null);
              }}
            />

            {anexo && (
              <small>
                Novo arquivo selecionado: {anexo.name}
              </small>
            )}

            <small>
              Se você não selecionar outro arquivo, o anexo atual será mantido.
            </small>
          </>
        )}
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="editar-botoes">
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>

        <button
          type="button"
          onClick={handleCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditarRecado;
