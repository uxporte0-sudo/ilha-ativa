import { cn } from '@/lib/utils';

/**
 * HeaderContainer
 * Responsabilidade única:
 * - espaçamento
 * - alinhamento
 * - safe-area
 * - background
 * - sombra
 * - padding
 * Nenhuma regra de negócio.
 */
export default function HeaderContainer({ 
  children, 
  className,
  variant = 'DEFAULT'
}) {
  const baseStyles = cn(
    'shrink-0',
    'flex items-center justify-between',
    'h-16 px-4',
    'bg-surface-base/95 backdrop-blur-xl border-b border-borderSemantic-subtle',
    'safe-area-inset-top',
    className
  );

  return (
    <header className={baseStyles} role="banner">
      {children}
    </header>
  );
}
