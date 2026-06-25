import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import AppScreen from '@/components/layout/AppScreen';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/input';
import LOGO_URL from '@/components/assets/logo.webp';

const LoginScreen = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [state, setState] = useState('empty'); // empty, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState('loading');
    setError(null);
    try {
      const credentials = { email, password };
      const session = await login(credentials);
      setState('success');
      // User autenticado não permanece em Login (criterio 61)
      // Após autenticação, User sem preferências é enviado para Onboarding
      if (session.user) {
        if (session.preferenciasPendentes) {
          navigate('/onboarding');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  const handleOpenRegister = () => {
    navigate('/cadastro');
  };

  const handleForgotPassword = () => {
    navigate('/recuperar-senha');
  };

  const handleGoogleLogin = () => {
    // TODO: Implementar login com Google
    console.log('Login com Google');
  };

  const handleFacebookLogin = () => {
    // TODO: Implementar login com Facebook
    console.log('Login com Facebook');
  };

  return (
    <AppScreen variant="default">
      <div className="flex flex-col items-center gap-6">
        <div className="logo">
          <img src={LOGO_URL} alt="IlhAtiva" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Bem-vindo</h2>
        
        {state === 'error' && error && (
          <div className="w-full p-3 rounded-lg bg-error/10 border border-error text-error text-sm text-center">
            {error}
          </div>
        )}
        
        {state === 'loading' && (
          <div className="w-full p-3 rounded-lg bg-brand-primary/10 border border-brand-primary text-brand-primary text-sm text-center">
            Entrando...
          </div>
        )}
        
        {state === 'success' && (
          <div className="w-full p-3 rounded-lg bg-success/10 border border-success text-success text-sm text-center">
            Autenticado com sucesso! Redirecionando...
          </div>
        )}
        
        {(state === 'empty' || state === 'error') && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <TextField
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={state === 'loading'}
            />
            <TextField
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={state === 'loading'}
            />
            <Button type="submit" className="w-full" disabled={state === 'loading'}>
              {state === 'loading' ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        )}
        
        <div className="w-full flex flex-col gap-3">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={state === 'loading'}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Entrar com Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleFacebookLogin} disabled={state === 'loading'}>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Entrar com Facebook
          </Button>
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <Button variant="ghost" className="w-full" onClick={handleOpenRegister} disabled={state === 'loading'}>
            Criar Conta
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleForgotPassword} disabled={state === 'loading'}>
            Esqueceu a senha?
          </Button>
        </div>
      </div>
    </AppScreen>
  );
};

export default LoginScreen;
