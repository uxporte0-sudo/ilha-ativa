import { MAIN_MENU_ITEMS } from '@/constants/navigation';
import CircleButton from '@/components/navigation/CircleButton';
import CreateAtivoAction from '@/components/navigation/CreateAtivoAction';

export default function MainMenu() {
  return (
    <nav className="shrink-0 w-full rounded-t-[28px] bg-surface-menu px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-5 shadow-menu overflow-visible" aria-label="Navegação principal">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full z-10">
          <div className="translate-y-1/2">
            <CreateAtivoAction />
          </div>
        </div>
        <div className="grid grid-cols-5 items-center gap-2">
          {MAIN_MENU_ITEMS.map((item, index) => (
            <>
              {index === 2 && <div aria-hidden="true" />}
              <CircleButton key={item.id} to={item.route} icon={item.icon} label={item.label} />
            </>
          ))}
        </div>
      </div>
    </nav>
  );
}
