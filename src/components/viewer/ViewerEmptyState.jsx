import { cn } from '@/lib/utils';

export default function ViewerEmptyState({ title, description, className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2 py-8 text-center', className)}
      {...props}
    >
      <p className="text-base font-medium text-text-primary">{title}</p>
      {description && <p className="text-sm text-text-secondary">{description}</p>}
      {children}
    </div>
  );
}
