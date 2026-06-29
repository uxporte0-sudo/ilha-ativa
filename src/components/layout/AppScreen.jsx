import { cn } from '@/lib/utils';

/**
 * AppScreen
 *
 * Componente de wrapper para telas da aplicação.
 *
 * Modos:
 * - Default: mantém paddings para telas convencionais (formulários, listas)
 * - Fullscreen: remove paddings para telas que ocupam toda a área (mapa, visualizações)
 *
 * Uso:
 * <AppScreen variant="warm">           → tela padrão com padding
 * <AppScreen variant="warm" fullscreen> → tela fullscreen sem padding
 */
export default function AppScreen({ className, children, variant = 'default', fullscreen = false }) {
  const variantClass = {
    default: 'bg-surface-base',
    warm: 'bg-surface-base',
    accent: 'bg-container-accent',
    inverse: 'bg-surface-inverse text-text-inverse',
  }[variant];

  if (fullscreen) {
    return (
      <section className={cn('h-full max-h-full w-full overflow-hidden text-text-primary', variantClass, className)}>
        {children}
      </section>
    );
  }

  return (
    <section className={cn('h-full max-h-full w-full overflow-y-auto overflow-x-hidden text-text-primary', variantClass, className)}>
      <div className="mx-auto flex w-full max-w-[382px] flex-col gap-6 px-5 py-6">
        {children}
      </div>
    </section>
  );
}
