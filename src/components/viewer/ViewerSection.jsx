import { cn } from '@/lib/utils';

export default function ViewerSection({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-secondary p-4 shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
