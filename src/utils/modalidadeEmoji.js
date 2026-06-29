/**
 * Utilitário para resolver o emoji correspondente a uma modalidade esportiva.
 * Centraliza o mapeamento utilizado por AtivoHomeCard, AtivoViewer e AtivoPin.
 */

const modalidadeEmojis = {
  futebol: '⚽',
  volei: '🏐',
  vôlei: '🏐',
  basquete: '🏀',
  tenis: '🎾',
  tênis: '🎾',
  corrida: '🏃',
  caminhada: '🚶',
  trilha: '🥾',
  ciclismo: '🚴',
  pedal: '🚴',
  surf: '🏄',
  yoga: '🧘',
  natacao: '🏊',
  natação: '🏊',
};

export function getModalidadeEmoji(modalidade) {
  if (!modalidade) return '🏅';
  return modalidadeEmojis[modalidade.toLowerCase()] ?? '🏅';
}