
import { useState, useEffect } from 'react';
import Cadastro from './pages/cadastro.jsx';
import Login from './pages/login.jsx';
import Recados from './pages/recados.jsx';
import './App.css';
import api from './services/api.jsx';
import AdminRecados from './pages/AdminRecados.jsx';


function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [tela, setTela] = useState('login');

  // Verifica se já existe uma sessão ativa
  useEffect(() => {
    async function verificarSessao() {
      try {
        const { data } = await api.get('/user');
        setUsuario(data);
      } catch (erro) {
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }

    verificarSessao();
  }, []);

  function handleAutenticado(novoUsuario) {
    setUsuario(novoUsuario);
  }

  async function handleLogout() {
    try {
      await api.post('/logout');
      setUsuario(null);
      setTela('login');
    } catch (erro) {
      alert('Não foi possível sair. Tente novamente.');
    }
  }

  function handleCadastroSucesso() {
    alert('Cadastro realizado! Faça login para continuar.');
    setTela('login');
  }

  if (carregando) {
    return <p>Verificando sessão...</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recados</h1>

        {usuario && (
          <button onClick={handleLogout}>Sair</button>
        )}
      </header>

      <main>
        {usuario ? (
          usuario.role === 'admin' ? (
            <AdminRecados />
          ) : (
            <Recados usuario={usuario} />
          )
        ) : tela === 'login' ? (
          <>
            <Login onLogin={handleAutenticado} />

            <p>
              Não tem conta?{' '}
              <button onClick={() => setTela('cadastro')}>
                Cadastre-se
              </button>
            </p>
          </>
        ) : (
          <>
            <Cadastro onCadastroSucesso={handleCadastroSucesso} />

            <p>
              Já tem conta?{' '}
              <button onClick={() => setTela('login')}>
                Fazer login
              </button>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
