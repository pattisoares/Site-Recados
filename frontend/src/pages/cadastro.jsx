import { useState } from 'react';
import api from '../services/api';
import './cadastro.css';

function Cadastro({ onCadastroSucesso }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (password.length < 8) {
      setErro('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErro('As senhas não conferem.');
      return;
    }

    setEnviando(true);
    try {
      await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      // Cadastro feito com sucesso, mas o backend não retorna token
      // então avisamos o usuário para fazer login em seguida
      onCadastroSucesso();
    } catch (err) {
      if (err.response?.status === 422) {
        const erros = err.response.data.errors;
        const primeiraMsg = erros ? Object.values(erros)[0][0] : 'Verifique os dados informados.';
        setErro(primeiraMsg);
      } else {
        setErro('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cadastro">
      <h2>Criar conta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="password_confirmation">Confirme a senha</label>
          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Repita a senha"
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}

export default Cadastro;