import { CalendarDays, Home, MapPin, UserRound } from 'lucide-react';
import CircleButton from '@/components/navigation/CircleButton';
import CreateAtivoAction from '@/components/navigation/CreateAtivoAction';

export default function MainMenu() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[412px] -translate-x-1/2 rounded-t-[28px] bg-surface-menu px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-5 shadow-menu" aria-label="Navegação principal">
      <div className="grid grid-cols-5 items-end gap-2">
        <CircleButton to="/" icon={Home} label="Home" />
        <CircleButton to="/mapa" icon={MapPin} label="Mapa" />
        <CreateAtivoAction />
        <CircleButton to="/agenda" icon={CalendarDays} label="Agenda" />
        <CircleButton to="/conta" icon={UserRound} label="Conta" />
      </div>
    </nav>
  );
}
