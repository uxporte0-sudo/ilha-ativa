import { cn } from '@/lib/utils';

export default function AppScreen({ className, children, variant = 'default' }) {
  const variantClass = {
    default: 'bg-surface-base',
    warm: 'bg-surface-base2',
    accent: 'bg-container-accent',
    inverse: 'bg-surface-inverse text-text-inverse',
  }[variant];

  return (
    <section className={cn('min-h-full w-full px-5 py-6 text-text-primary', variantClass, className)}>
      <div className="mx-auto flex w-full max-w-[382px] flex-col gap-6">
        {children}
      </div>
    </section>
  );
}
