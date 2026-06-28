import { cn } from '@/lib/utils';

export default function ViewerMetadataList({ className, children, ...props }) {
  return (
    <dl
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      {children}
    </dl>
  );
}

export function ViewerMetadataItem({ label, value, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)} {...props}>
      <dt className="text-xs font-bold uppercase text-text-tertiary">{label}</dt>
      <dd className="text-sm font-medium text-text-primary">{value}</dd>
    </div>
  );
}
