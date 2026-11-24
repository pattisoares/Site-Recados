import { useEffect, useState } from 'react';
import api from '../services/api.jsx';

function AdminRecados() {
  const [recados, setRecados] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarRecados() {
      try {
        const resposta = await api.get('/admin/recados');
        setRecados(resposta.data);
      } catch (erro) {
        if (erro.response?.status === 403) {
          setErro('Acesso permitido somente para administradores.');
        } else {
          setErro('Não foi possível carregar os recados.');
        }
      }
    }

    carregarRecados();
  }, []);

  return (
    <div>
      <h2>Moderação de Recados</h2>

      {erro && <p>{erro}</p>}

      {recados.map((recado) => (
        <div key={recado.id}>
          <h3>{recado.titulo}</h3>
          <p>{recado.texto}</p>
          <p>
            Autor: {recado.user?.name || 'Usuário não identificado'}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminRecados;