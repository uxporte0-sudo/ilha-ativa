import { cn } from '@/lib/utils';

export default function ViewerLoadingState({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-center py-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}
