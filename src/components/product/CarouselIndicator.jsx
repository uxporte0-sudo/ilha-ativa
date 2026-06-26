import { cn } from '@/lib/utils';

/**
 * CarouselIndicator - Componente de indicadores de navegação do carrossel
 * 
 * @param {Object} props
 * @param {number} props.count - Quantidade total de slides
 * @param {number} props.currentIndex - Índice do slide ativo (0-based)
 * @param {Function} [props.onSelect] - Callback opcional ao clicar em um indicador
 * @param {string} [props.className] - Classes CSS adicionais
 */
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
        'flex items-center gap-2',
        'mt-6',
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
            'w-2 h-2 rounded-full transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            index === currentIndex
              ? 'bg-primary-600 w-6'
              : 'bg-white/40 hover:bg-white/60'
          )}
        />
      ))}
    </div>
  );
}