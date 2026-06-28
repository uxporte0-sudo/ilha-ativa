import { cn } from '@/lib/utils';

export default function ViewerBadgeGroup({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}
