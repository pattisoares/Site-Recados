import { useState } from 'react';
import api from '../services/api.jsx';

function ExcluirRecado({ id, onExcluir }) {
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    const confirmar = window.confirm('Tem certeza que deseja excluir este recado?');
    if (!confirmar) return;

    setExcluindo(true);
    try {
      await api.delete(`/recados/${id}`);
      onExcluir(id);
    } catch (err) {
      alert('Erro ao excluir recado.');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <button className="btn-excluir" onClick={handleExcluir} disabled={excluindo}>
      {excluindo ? 'Excluindo...' : 'Excluir'}
    </button>
  );
}

export default ExcluirRecado;