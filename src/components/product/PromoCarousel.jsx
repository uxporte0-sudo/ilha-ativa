import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PromoSlide from './PromoSlide';
import CarouselIndicator from './CarouselIndicator';
import { PROMO_TYPES } from './promo.types';

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

  const updateNavigationState = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setCurrentIndex(api.selectedScrollSnap());
  }, []);

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

  useEffect(() => {
    if (!emblaApi || autoPlayInterval <= 0) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [emblaApi, autoPlayInterval]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleIndicatorSelect = useCallback((index) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

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
      className={cn('w-full', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promoções em destaque"
      onKeyDownCapture={handleKeyDown}
    >
      <div 
        className="relative w-full aspect-video max-h-[20dvh] rounded-2xl overflow-hidden bg-surface-base"
      >
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className="min-w-0 shrink-0 grow-0 basis-full h-full"
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

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 md:left-0 md:-ml-6',
            'h-10 w-10 rounded-full',
            'bg-black/30 hover:bg-black/50',
            'text-white',
            'border-white/20',
            'shadow-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-white/50',
            !canScrollPrev && 'opacity-30 pointer-events-none'
          )}
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          aria-label="Slide anterior"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Slide anterior</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 md:right-0 md:-mr-6',
            'h-10 w-10 rounded-full',
            'bg-black/30 hover:bg-black/50',
            'text-white',
            'border-white/20',
            'shadow-lg',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-white/50',
            !canScrollNext && 'opacity-30 pointer-events-none'
          )}
          disabled={!canScrollNext}
          onClick={scrollNext}
          aria-label="Próximo slide"
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Próximo slide</span>
        </Button>
      </div>

      <CarouselIndicator
        count={slides.length}
        currentIndex={currentIndex}
        onSelect={handleIndicatorSelect}
      />
    </div>
  );
}

export { MOCK_SLIDES };
