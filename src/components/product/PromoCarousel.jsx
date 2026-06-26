import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PromoSlide from './PromoSlide';
import CarouselIndicator from './CarouselIndicator';
import { PROMO_TYPES } from './promo.types';

/**
 * Dados mockados para o PromoCarousel
 * Em produção, estes dados viriam de uma API/CMS
 */
const MOCK_SLIDES = [
  {
    id: 'slide-1',
    type: PROMO_TYPES.EVENT,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80',
    title: 'Festival Esportivo',
    description: 'Participe do maior festival de esportes da ilha. Competições, workshops e muito mais!',
    cta: {
      label: 'Saiba mais',
      href: '/eventos/festival-esportivo',
    },
  },
  {
    id: 'slide-2',
    type: PROMO_TYPES.CAMPAIGN,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
    title: 'Descubra novos Ativos',
    description: 'Explore quadras, trilhas e espaços esportivos inéditos na sua região.',
    cta: {
      label: 'Explorar',
      href: '/explorar',
    },
  },
  {
    id: 'slide-3',
    type: PROMO_TYPES.ANNOUNCEMENT,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    title: 'Ajude na Zeladoria',
    description: 'Junte-se à comunidade para manter nossos espaços esportivos sempre prontos para uso.',
    cta: {
      label: 'Participar',
      href: '/zeladoria',
    },
  },
];

/**
 * PromoCarousel - Carrossel promocional principal
 * 
 * Responsabilidades:
 * - Controlar os slides (embla-carousel)
 * - Controlar o índice atual
 * - Renderizar PromoSlide
 * - Renderizar CarouselIndicator
 * 
 * @param {Object} props
 * @param {Array} [props.slides] - Array de slides (usa mock se não fornecido)
 * @param {number} [props.autoPlayInterval] - Intervalo de autoplay em ms (0 para desabilitar)
 * @param {string} [props.className] - Classes CSS adicionais
 */
export default function PromoCarousel({ 
  slides = MOCK_SLIDES,
  autoPlayInterval = 5000,
  className 
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    slidesToScroll: 1,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Atualiza estado de navegação
  const updateNavigationState = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setCurrentIndex(api.selectedScrollSnap());
  }, []);

  // Efeito para sincronizar com a API do Embla
  useEffect(() => {
    if (!emblaApi) return;
    
    updateNavigationState(emblaApi);
    emblaApi.on('reInit', updateNavigationState);
    emblaApi.on('select', updateNavigationState);
    emblaApi.on('scroll', updateNavigationState);

    return () => {
      emblaApi.off('reInit', updateNavigationState);
      emblaApi.off('select', updateNavigationState);
      emblaApi.off('scroll', updateNavigationState);
    };
  }, [emblaApi, updateNavigationState]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || autoPlayInterval <= 0) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [emblaApi, autoPlayInterval]);

  // Handlers de navegação
  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleIndicatorSelect = useCallback((index) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    }
  }, [scrollPrev, scrollNext]);

  return (
    <div 
      className={cn('relative', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promoções em destaque"
      onKeyDownCapture={handleKeyDown}
    >
      {/* Viewport do carrossel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              role="group"
              aria-roledescription="slide"
              aria-label={slide.title}
            >
              <PromoSlide
                image={slide.image}
                title={slide.title}
                description={slide.description}
                cta={slide.cta}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botão anterior */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8',
          'h-12 w-12 rounded-full',
          'bg-white/10 hover:bg-white/20',
          'text-white',
          'border-white/20 hover:border-white/30',
          'shadow-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black/50',
          !canScrollPrev && 'opacity-30 pointer-events-none'
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label="Slide anterior"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Slide anterior</span>
      </Button>

      {/* Botão próximo */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          'absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8',
          'h-12 w-12 rounded-full',
          'bg-white/10 hover:bg-white/20',
          'text-white',
          'border-white/20 hover:border-white/30',
          'shadow-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black/50',
          !canScrollNext && 'opacity-30 pointer-events-none'
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label="Próximo slide"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Próximo slide</span>
      </Button>

      {/* Indicadores */}
      <CarouselIndicator
        count={slides.length}
        currentIndex={currentIndex}
        onSelect={handleIndicatorSelect}
      />
    </div>
  );
}

// Exportar slides mockados para uso externo se necessário
export { MOCK_SLIDES };