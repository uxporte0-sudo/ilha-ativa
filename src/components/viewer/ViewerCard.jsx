import { cn } from '@/lib/utils';

export default function ViewerCard({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-[var(--radius-card)] bg-surface-base p-4 shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  );
}
