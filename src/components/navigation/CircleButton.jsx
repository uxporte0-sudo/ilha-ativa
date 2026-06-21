import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function CircleButton({ to, icon: Icon, label, selected, className, size = 'default' }) {
  const sizeClass = size === 'large' ? 'h-20 w-20' : 'h-14 w-14';

  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'group flex flex-col items-center gap-1 text-[11px] font-semibold text-text-inverse outline-none',
          className
        )
      }
    >
      {({ isActive }) => {
        const active = selected ?? isActive;
        return (
          <>
            <span
              className={cn(
                'flex items-center justify-center rounded-full border border-white/10 transition-all focus-visible:ring-2 focus-visible:ring-interaction-focus',
                sizeClass,
                active ? 'bg-brand-secondary text-text-primary' : 'bg-container-secondary/15 text-text-inverse hover:bg-container-secondary/25'
              )}
            >
              <Icon className={cn(size === 'large' ? 'h-9 w-9' : 'h-6 w-6')} />
            </span>
            <span className="max-w-[72px] truncate leading-tight">{label}</span>
          </>
        );
      }}
    </NavLink>
  );
}
