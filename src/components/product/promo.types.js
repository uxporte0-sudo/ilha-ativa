/**
 * Tipos de promoção para o PromoCarousel
 * Usados para categorizar os slides do carrossel
 */

export const PROMO_TYPES = {
  CAMPAIGN: 'CAMPAIGN',
  EVENT: 'EVENT',
  PARTNER: 'PARTNER',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
};

/**
 * Tipos válidos de promoção
 * @typedef {'CAMPAIGN'|'EVENT'|'PARTNER'|'ANNOUNCEMENT'} PromoType
 */

/**
 * Configuração de um slide do PromoCarousel
 * @typedef {Object} PromoSlideConfig
 * @property {string} id - Identificador único do slide
 * @property {PromoType} type - Tipo da promoção
 * @property {string} image - URL da imagem
 * @property {string} title - Título do slide
 * @property {string} description - Descrição do slide
 * @property {Object} [cta] - Call to action opcional
 * @property {string} cta.label - Texto do botão
 * @property {string} cta.href - Link de destino
 */