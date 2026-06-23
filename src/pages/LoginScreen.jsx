import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { AuthService } from '@/domain/user/AuthService';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const { user, isLoadingAuth, authError, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const credentials = { id: email, password };
      const session = await AuthService.login(credentials);
      // User autenticado não permanece em Login (criterio 61)
      if (session.user) {
        // Redireciona para Onboarding se sem preferencias, senão para Home?
        // According spec, after auth, user without preferences goes to Onboarding
        if (session.preferenciasPendentes) {
          navigate('/home');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRegister = () => {
    navigate('/cadastro');
  };

  const handleForgotPassword = () => {
    navigate('/recuperar-senha');
  };

  return (
    <div className="login-screen">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <h2>Bem-vindo</h2>
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Entrando...</div>}
      {!loading && !error && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="links">
            <button type="button" onClick={handleOpenRegister}>
              Criar Conta
            </button>
            <button type="button" onClick={handleForgotPassword}>
              Esqueceu a senha?
            </button>
          </div>
        </>
      )}
      {(!loading && user) && (
        <div className="auto-signout">
          Sair
        </div>
      )}
    </div>
  );
};

export default LoginScreen;