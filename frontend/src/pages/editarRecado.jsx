import { useState } from 'react';
import api from '../services/api.jsx';

function EditarRecado({ recado, onEditar, editando, setEditando }) {
  const [titulo, setTitulo] = useState(recado.titulo);
  const [Texto, setTexto] = useState(recado.Texto);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  function handleCancelar() {
    setTitulo(recado.titulo);
    setTexto(recado.Texto);
    setErro(null);
    setEditando(false);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || !Texto.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    setSalvando(true);
    try {
      const { data } = await api.put(`/recados/${recado.id}`, { titulo, Texto });
      onEditar(data);
      setEditando(false);
    } catch (err) {
      setErro('Erro ao salvar alterações.');
    } finally {
      setSalvando(false);
    }
  }

  if (!editando) {
    return (
      <button className="btn-editar" onClick={() => setEditando(true)}>
        Editar
      </button>
    );
  }

  return (
    <form onSubmit={handleSalvar} className="editar-recado-form">
      <div>
        <label htmlFor={`titulo-${recado.id}`}>Título</label>
        <input
          id={`titulo-${recado.id}`}
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`Texto-${recado.id}`}>Descrição</label>
        <textarea
          id={`Texto-${recado.id}`}
          value={Texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="editar-botoes">
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
        <button type="button" onClick={handleCancelar} disabled={salvando}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EditarRecado;