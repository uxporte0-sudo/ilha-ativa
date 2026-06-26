/**
 * header.types.js
 * Constantes para as futuras variantes do Header.
 * Não implementar lógica. Apenas preparar arquitetura.
 */

export const HEADER_VARIANTS = {
  DEFAULT: 'DEFAULT',
  TRANSPARENT: 'TRANSPARENT',
  MAP: 'MAP',
  MINIMAL: 'MINIMAL',
};

export const HEADER_ACTIONS = {
  NOTIFICATION: 'NOTIFICATION',
  AVATAR: 'AVATAR',
  SEARCH: 'SEARCH',
  FILTER: 'FILTER',
  SHARE: 'SHARE',
};

export const HEADER_POSITIONS = {
  FIXED: 'FIXED',
  STICKY: 'STICKY',
  RELATIVE: 'RELATIVE',
};

export const HEADER_HEIGHTS = {
  DEFAULT: 'h-16',
  COMPACT: 'h-12',
  EXPANDED: 'h-20',
};

export default {
  HEADER_VARIANTS,
  HEADER_ACTIONS,
  HEADER_POSITIONS,
  HEADER_HEIGHTS,
};