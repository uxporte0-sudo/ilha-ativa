import { MAIN_MENU_ITEMS } from '@/constants/navigation';
import CircleButton from '@/components/navigation/CircleButton';
import CreateAtivoAction from '@/components/navigation/CreateAtivoAction';

export default function MainMenu() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[412px] -translate-x-1/2 rounded-t-[28px] bg-surface-menu px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-5 shadow-menu" aria-label="Navegação principal">
      <div className="grid grid-cols-5 items-end gap-2">
        {MAIN_MENU_ITEMS.map((item, index) => (
          <>
            {index === 2 && <CreateAtivoAction />}
            <CircleButton to={item.route} icon={item.icon} label={item.label} />
          </>
        ))}
      </div>
    </nav>
  );
}
