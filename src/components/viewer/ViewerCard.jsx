import { cn } from '@/lib/utils';

export default function ViewerCard({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-primary p-4 shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  );
}
