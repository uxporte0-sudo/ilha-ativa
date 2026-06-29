import { Outlet } from 'react-router-dom';
import MainMenu from '@/components/navigation/MainMenu';
import PersistentHeader from './PersistentHeader';
import PresentationOverlay from '@/components/demo/PresentationOverlay';

export default function AppShell() {
  return (
    <div className="h-screen bg-surface-base2 text-text-primary">
      <div className="mx-auto flex h-screen w-full max-w-[412px] flex-col bg-surface-base shadow-card relative overflow-hidden">

        <PresentationOverlay />

        <PersistentHeader />

        <main className="relative flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>

        <MainMenu />
      </div>
    </div>
  );
}
