import { Outlet } from 'react-router-dom';
import MainMenu from '@/components/navigation/MainMenu';
import PersistentHeader from './PersistentHeader';
import PresentationOverlay from '@/components/demo/PresentationOverlay';

export default function AppShell() {
  return (
    <div className="h-dvh bg-surface-base2 text-text-primary">
      <div className="mx-auto flex h-dvh w-full max-w-[412px] flex-col bg-surface-base shadow-card relative">

        <PresentationOverlay />

        <PersistentHeader />

        <main className="relative flex-1 min-h-0">
          <Outlet />
        </main>

        <MainMenu />
      </div>
    </div>
  );
}
