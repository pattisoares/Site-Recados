import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tela, setTela] = useState('login');

  function handleAutenticado(novoToken) {
    setToken(novoToken);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setTela('login');
  }

  function handleCadastroSucesso() {
    alert('Cadastro realizado! Faça login para continuar.');
    setTela('login');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recados</h1>
        {token && <button onClick={handleLogout}>Sair</button>}
      </header>

      <main>
        {token ? (
          <Recados />
        ) : tela === 'login' ? (
          <>
            <Login onLogin={handleAutenticado} />
            <p>
              Não tem conta?{' '}
              <button onClick={() => setTela('cadastro')}>Cadastre-se</button>
            </p>
          </>
        ) : (
          <>
            <Cadastro onCadastroSucesso={handleCadastroSucesso} />
            <p>
              Já tem conta?{' '}
              <button onClick={() => setTela('login')}>Fazer login</button>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App
