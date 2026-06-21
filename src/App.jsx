import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppShell from '@/components/layout/AppShell';
import AccountScreen from '@/pages/AccountScreen';
import AgendaScreen from '@/pages/AgendaScreen';
import AtivoDetailsScreen from '@/pages/AtivoDetailsScreen';
import CreateAtivoScreen from '@/pages/CreateAtivoScreen';
import HomeScreen from '@/pages/HomeScreen';
import LocalScreen from '@/pages/LocalScreen';
import MapScreen from '@/pages/MapScreen';
import RetrospectiveScreen from '@/pages/RetrospectiveScreen';
import SpecPlaceholder from '@/pages/SpecPlaceholder';
import { legacyRedirects } from '@/routes/legacyRedirects';

const appRoutes = [
  { path: '/', title: 'Home', spec: 'home', route: '/' },
  { path: '/mapa', title: 'Mapa', spec: 'mapa', route: '/mapa' },
  { path: '/agenda', title: 'Agenda', spec: 'agenda', route: '/agenda' },
  { path: '/ativos/novo', title: 'Criar Ativo', spec: 'criarAtivo', route: '/ativos/novo' },
  { path: '/ativos/:ativoId', title: 'Detalhes do Ativo', spec: 'ativoDetalhes', route: '/ativos/:ativoId', showBack: true },
  { path: '/locais/:localId', title: 'Local', spec: 'local', route: '/locais/:localId', showBack: true },
  { path: '/zeladoria', title: 'Zeladoria', spec: 'zeladoria', route: '/zeladoria' },
  { path: '/zeladoria/nova', title: 'Nova Zeladoria', spec: 'zeladoria', route: '/zeladoria/nova', showBack: true },
  { path: '/zeladoria/:zeladoriaId', title: 'Detalhes da Zeladoria', spec: 'zeladoria', route: '/zeladoria/:zeladoriaId', showBack: true },
  { path: '/retrospectiva', title: 'Retrospectiva', spec: 'retrospectiva', route: '/retrospectiva', showBack: true },
  { path: '/conta', title: 'Conta', spec: 'conta', route: '/conta' },
];

const publicRoutes = [
  { path: '/login', title: 'Login', spec: 'login', route: '/login' },
  { path: '/cadastro', title: 'Cadastro', spec: 'cadastro', route: '/cadastro', showBack: true },
  { path: '/onboarding', title: 'Onboarding', spec: 'onboarding', route: '/onboarding' },
];

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-base2">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-container-primary-strong border-t-brand-primary" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }

    if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<SpecPlaceholder {...route} variant="warm" />}
        />
      ))}

      <Route element={<AppShell />}>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.path === '/' ? (
                <HomeScreen />
              ) : route.path === '/mapa' ? (
                <MapScreen />
              ) : route.path === '/agenda' ? (
                <AgendaScreen />
              ) : route.path === '/conta' ? (
                <AccountScreen />
              ) : route.path === '/ativos/novo' ? (
                <CreateAtivoScreen />
              ) : route.path === '/ativos/:ativoId' ? (
                <AtivoDetailsScreen />
              ) : route.path === '/locais/:localId' ? (
                <LocalScreen />
              ) : route.path === '/retrospectiva' ? (
                <RetrospectiveScreen />
              ) : (
                <SpecPlaceholder {...route} />
              )
            }
          />
        ))}
      </Route>

      {legacyRedirects.map((redirect) => (
        <Route
          key={redirect.from}
          path={redirect.from}
          element={<Navigate to={redirect.to} replace state={{ reason: redirect.reason }} />}
        />
      ))}

      <Route
        path="*"
        element={<SpecPlaceholder title="Rota não encontrada" spec="notFound" route="*" variant="warm" showBack />}
      />
    </Routes>
  );
}

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
  );
}

export default App;


