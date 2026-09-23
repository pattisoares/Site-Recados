import { useState } from 'react';

function RecadoForm({ onCriar }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    setEnviando(true);
    try {
      await onCriar({ titulo, descricao });
      setTitulo('');
      setDescricao('');
    } catch (err) {
      console.error(err);
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
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Digite a descrição"
        />
      </div>

      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Criar recado'}
      </button>
    </form>
  );
}

export default RecadoForm;