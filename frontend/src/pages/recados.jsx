import { useState, useEffect } from 'react';
import axios from '../services/api.jsx'; 
import RecadoForm from './recadoForm.jsx';
import RecadoItem from './recadoItem.jsx';

function Recados() {
  const [recados, setRecados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarRecados() {
      try {
        setCarregando(true);

        const { data } = await axios.get('/recados');
        setRecados(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setErro('Erro ao carregar recados.');
      } finally {
        setCarregando(false);
      }
    }

    carregarRecados();
  }, []);

  function handleEditar(recadoAtualizado) {
    setRecados(prev =>
      prev.map(recado => (recado.id === recadoAtualizado.id ? recadoAtualizado : recado))
    );
  }

  function handleExcluir(id) {
    setRecados(prev => prev.filter(recado => recado.id !== id));
  }

  async function handleCriar(campos) {
    try {
      const { data } = await axios.post('/recados', campos);
      const novoRecado = data.data ?? data;
      setRecados(prev => [novoRecado, ...prev]);
    } catch (err) {
      setErro('Erro ao criar recado.');
    }
  }

  return (
    <div className="recados">
      <RecadoForm onCriar={handleCriar} />

      {carregando && <p>Carregando...</p>}
      {erro && <p className="erro">{erro}</p>}

      <ul>
        {recados.map(recado => (
          <RecadoItem
            key={recado.id}
            recado={recado}
            onExcluir={handleExcluir}
            onEditar={handleEditar}
          />
        ))}
      </ul>
    </div>
  );
}

export default Recados;