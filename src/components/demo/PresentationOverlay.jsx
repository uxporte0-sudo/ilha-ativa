import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import logotipo from '@/components/assets/Logotipo.png';

export default function PresentationOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(!document.fullscreenElement);
    };

    updateVisibility();

    document.addEventListener('fullscreenchange', updateVisibility);

    return () => {
      document.removeEventListener('fullscreenchange', updateVisibility);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleStartDemo = async () => {
    try {
      if (document.fullscreenEnabled && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen não disponível:', error);
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-surface-base/95 backdrop-blur-sm',
        'p-4'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="presentation-overlay-title"
    >
      <div
        className={cn(
          'w-full max-w-md',
          'rounded-2xl',
          'bg-container-secondary',
          'border border-border-subtle',
          'shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
          'p-8'
        )}
      >
        <div className="text-center">
          <div className="mb-6">
            <img
              src={logotipo}
              alt="IlhAtiva"
              className="mx-auto h-16 w-auto"
            />
          </div>

          <h1
            id="presentation-overlay-title"
            className="mb-4 text-2xl font-bold text-text-primary"
          >
            Bem-vindo ao IlhAtiva
          </h1>

          <p className="mb-8 text-text-secondary leading-relaxed">
            Para uma experiência mais imersiva durante esta demonstração,
            <br />
            recomendamos utilizar o modo tela cheia.
            <br />
            <br />
            Caso seu navegador não suporte essa funcionalidade,
            <br />
            você poderá continuar normalmente.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleStartDemo}
              className={cn(
                'w-full py-3 px-6 rounded-lg font-medium',
                'bg-brand-primary text-white',
                'hover:bg-brand-primary/90',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                'transition-colors'
              )}
              type="button"
            >
              Iniciar demonstração
            </button>

            <button
              onClick={handleDismiss}
              className={cn(
                'w-full py-3 px-6 rounded-lg font-medium',
                'bg-transparent text-text-primary',
                'border border-container-primary',
                'hover:bg-container-primary',
                'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                'transition-colors'
              )}
              type="button"
            >
              Continuar sem tela cheia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}