import { useState } from 'react';

function RecadoForm({ onCriar }) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim() || !texto.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    setEnviando(true);
    try {
      await onCriar({ titulo, texto });
      setTitulo('');
      setTexto('');
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
        <label htmlFor="texto">Descrição</label>
        <textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
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