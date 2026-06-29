import { Outlet, useLocation } from 'react-router-dom';
import MainMenu from '@/components/navigation/MainMenu';
import PersistentHeader from './PersistentHeader';
import PresentationOverlay from '@/components/demo/PresentationOverlay';

const HIDE_HEADER_PATHS = ['/ativos/novo', '/zeladoria/nova'];

export default function AppShell() {
  const location = useLocation();
  const shouldHideHeader = HIDE_HEADER_PATHS.some(path => location.pathname.startsWith(path));

  return (
    <div className="h-screen bg-surface-base2 text-text-primary">
      <div className="mx-auto flex h-screen w-full max-w-[412px] flex-col bg-surface-base shadow-card relative overflow-hidden">

        <PresentationOverlay />

        {!shouldHideHeader && <PersistentHeader />}

        <main className="relative flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>

        {!shouldHideHeader && <MainMenu />}
      </div>
    </div>
  );
}