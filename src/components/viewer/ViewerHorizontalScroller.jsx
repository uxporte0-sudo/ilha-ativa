import { cn } from '@/lib/utils';

export default function ViewerHorizontalScroller({ className, children, ...props }) {
  return (
    <div
      className={cn('-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none-mobile', className)}
      {...props}
    >
      {children}
    </div>
  );
}
