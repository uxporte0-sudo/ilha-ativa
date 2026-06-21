import { Outlet } from 'react-router-dom';
import MainMenu from '@/components/navigation/MainMenu';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-surface-base2 text-text-primary">
      <div className="mx-auto min-h-screen w-full max-w-[412px] bg-surface-base shadow-card">
        <main className="min-h-screen pb-36">
          <Outlet />
        </main>
        <MainMenu />
      </div>
    </div>
  );
}
