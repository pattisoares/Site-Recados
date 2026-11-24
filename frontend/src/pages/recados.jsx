
import { useState, useEffect } from 'react';
import axios from '../services/api.jsx';
import RecadoForm from './recadoForm.jsx';
import RecadoItem from './recadoItem.jsx';

function Recados({ usuario }) {
  const [recados, setRecados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucessoCriacao, setSucessoCriacao] = useState('');
  const [recadoEditadoId, setRecadoEditadoId] = useState(null);


  useEffect(() => {
    async function carregarRecados() {
      try {
        setCarregando(true);

        const { data } = await axios.get('/recados');

        const lista = Array.isArray(data)
          ? data
          : data.data || [];

        lista.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setRecados(lista);

      } catch (err) {
        console.log(
          'Erro na API:',
          err.response?.data || err.message
        );

        setErro(
          `Erro ao carregar recados. Código: ${
            err.response?.status || 'Sem resposta'
          }. ${
            err.response?.data?.message || err.message
          }`
        );

      } finally {
        setCarregando(false);
      }
    }

    carregarRecados();
  }, []);

  // Atualiza o recado depois da edição
  function handleEditar(recadoAtualizado) {
    setRecados(prev =>
      prev.map(recado =>
        recado.id === recadoAtualizado.id
          ? recadoAtualizado
          : recado
      )
    );

    setErro(null);
    setRecadoEditadoId(recadoAtualizado.id);
  }

  // Remove a mensagem de edição após 3 segundos
  useEffect(() => {
    if (recadoEditadoId === null) return;

    const temporizador = setTimeout(() => {
      setRecadoEditadoId(null);
    }, 3000);

    return () => clearTimeout(temporizador);
  }, [recadoEditadoId]);

  // Exclui o recado da lista
  function handleExcluir(id) {
    setRecados(prev =>
      prev.filter(recado => recado.id !== id)
    );

    if (recadoEditadoId === id) {
      setRecadoEditadoId(null);
    }
  }

  // Cria um novo recado
  async function handleCriar(formData) {
    try {
      setErro(null);
      setSucessoCriacao('');

      const { data } = await axios.post('/recados', formData);
      const novoRecado = data.data ?? data;

      setRecados(prev => [novoRecado, ...prev]);

      setSucessoCriacao('Recado criado com sucesso!');

    } catch (err) {
      setErro('Erro ao criar recado.');
      throw err;
    }
  }

  return (
    <div className="recados">

      <div className="recados-resumo">
        <h2>
          Olá, {usuario?.name || 'usuário'}!
        </h2>

        <p>
          Você possui <strong>{recados.length}</strong>{' '}
          {recados.length === 1 ? 'recado' : 'recados'}.
        </p>
      </div>


      <RecadoForm onCriar={handleCriar} />

      {sucessoCriacao && (
        <p className="mensagem-sucesso">
          {sucessoCriacao}
        </p>
      )}

      {carregando && <p>Carregando...</p>}

      {erro && <p className="erro">{erro}</p>}

      {!carregando && !erro && (
        <>
          {recados.length === 0 ? (
            <div className="recados-vazios">
              <h3>Você ainda não possui recados!</h3>
              <p>
                Que tal criar seu primeiro recado?
              </p>
            </div>
          ) : (
            <ul>
              {recados.map(recado => (
                <RecadoItem
                  key={recado.id}
                  recado={recado}
                  onExcluir={handleExcluir}
                  onEditar={handleEditar}
                  mensagemSucesso={
                    recadoEditadoId === recado.id
                  }
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Recados;
