import { useState } from 'react';

function RecadoForm({ onCriar }) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [anexo, setAnexo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function handleArquivoChange(e) {
    setAnexo(e.target.files[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || !texto.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('texto', texto);
    if (anexo) {
      formData.append('anexo', anexo);
    }

    setEnviando(true);
    try {
      await onCriar(formData);
      setTitulo('');
      setTexto('');
      setAnexo(null);
      e.target.reset(); // limpa visualmente o input de arquivo
    } catch (err) {
      if (err.response?.status === 422) {
        const erros = err.response.data.errors;
        const primeiraMsg = erros ? Object.values(erros)[0][0] : 'Verifique os dados informados.';
        setErro(primeiraMsg);
      } else {
        setErro('Erro ao criar recado.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="recado-form">
      <div>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o título do recado"
        />
      </div>

      <div>
        <label htmlFor="texto">Descrição</label>
        <textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite a descrição"
        />
      </div>

      <div>
        <label htmlFor="anexo">Anexo (opcional)</label>
        <input
          id="anexo"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleArquivoChange}
        />
        <small>Formatos aceitos: JPG, JPEG e PNG Máximo 2MB.</small>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Criar recado'}
      </button>
    </form>
  );
}

export default RecadoForm;