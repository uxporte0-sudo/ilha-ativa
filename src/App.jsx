import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Courts from '@/pages/Courts';
import NewBooking from '@/pages/NewBooking';
import NewRepairRequest from '@/pages/NewRepairRequest';
import MyRequests from '@/pages/MyRequests';
import Perfil from '@/pages/Perfil';

/**
 * AuthenticatedApp
 *
 * Componente responsável por decidir o que a aplicação deve exibir depois que
 * o contexto de autenticação estiver disponível.
 *
 * Fluxo:
 * - enquanto carrega configurações públicas/autenticação, mostra um loading;
 * - se houver erro de autenticação, mostra a tela adequada ou redireciona;
 * - se estiver tudo certo, renderiza as rotas principais da aplicação.
 */
const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Loading inicial enquanto o app confere configurações públicas e autenticação.
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Tratamento centralizado dos estados de erro de autenticação.
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Quando o login é obrigatório, delega o redirecionamento ao AuthContext.
      navigateToLogin();
      return null;
    }
  }

  // Rotas internas da aplicação.
  // Para criar uma nova página:
  // 1. crie o componente em src/pages;
  // 2. importe o componente neste arquivo;
  // 3. adicione um novo <Route /> dentro do AppLayout se ela usar Header/Sidebar.
  return (
    <Routes>
      {/* Rotas com layout padrão: Header, Sidebar e área principal via <Outlet />. */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quadras" element={<Courts />} />
        <Route path="/agendar" element={<NewBooking />} />
        <Route path="/reparos/novo" element={<NewRepairRequest />} />
        <Route path="/minhas-solicitacoes" element={<MyRequests />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Fallback para qualquer rota não cadastrada. */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

/**
 * App
 *
 * Raiz da aplicação.
 *
 * Providers usados aqui:
 * - AuthProvider: disponibiliza autenticação e configurações do app;
 * - QueryClientProvider: habilita cache e requisições via React Query;
 * - Router: ativa o roteamento do react-router-dom;
 * - Toaster: renderiza notificações globais.
 */
function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename={import.meta.env.BASE_URL}>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
