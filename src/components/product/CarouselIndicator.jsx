import { cn } from '@/lib/utils';

export default function CarouselIndicator({ 
  count, 
  currentIndex, 
  onSelect, 
  className 
}) {
  if (count <= 1) return null;

  return (
    <div 
      className={cn(
        'flex items-center justify-center gap-2 py-3',
        className
      )}
      role="tablist"
      aria-label="Navegação do carrossel"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === currentIndex}
          aria-label={`Ir para slide ${index + 1}`}
          onClick={() => onSelect?.(index)}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
            index === currentIndex
              ? 'bg-brand-primary w-6'
              : 'bg-surface-card w-2 hover:bg-text-tertiary'
          )}
        />
      ))}
    </div>
  );
}
