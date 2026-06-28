import { cn } from '@/lib/utils';

export default function ViewerHeroImage({ src, alt, className, children, ...props }) {
  if (src) {
    return (
      <div className={cn('relative overflow-hidden', className)} {...props}>
        <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" />
        {children}
      </div>
    );
  }

  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}
