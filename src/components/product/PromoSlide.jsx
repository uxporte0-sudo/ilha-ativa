import { cn } from '@/lib/utils';

/**
 * PromoSlide - Componente de apresentação para um slide do carrossel promocional
 * 
 * @param {Object} props
 * @param {string} props.image - URL da imagem do slide
 * @param {string} props.title - Título do slide
 * @param {string} props.description - Descrição do slide
 * @param {Object} [props.cta] - Call to action opcional
 * @param {string} props.cta.label - Texto do botão CTA
 * @param {string} props.cta.href - Link de destino do CTA
 * @param {string} [props.className] - Classes CSS adicionais
 */
export default function PromoSlide({ 
  image, 
  title, 
  description, 
  cta, 
  className 
}) {
  return (
    <div 
      className={cn(
        'relative w-full min-w-0 shrink-0 grow-0 basis-full',
        'rounded-2xl overflow-hidden',
        'bg-surface-base',
        className
      )}
      role="group"
      aria-roledescription="slide"
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Overlay escuro para legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Conteúdo do slide */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
            {title}
          </h2>
          
          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6 max-w-md">
            {description}
          </p>

          {/* CTA opcional */}
          {cta && (
            <a
              href={cta.href}
              className={cn(
                'inline-flex items-center gap-2',
                'px-5 py-2.5',
                'bg-primary-600 hover:bg-primary-700',
                'text-white',
                'font-semibold',
                'rounded-lg',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-black/50'
              )}
            >
              {cta.label}
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4-4 4m-6-8h9a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}