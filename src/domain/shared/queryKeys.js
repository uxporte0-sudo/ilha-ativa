export const queryKeys = {
  user: {
    current: () => ['user', 'current'],
    byId: (userId) => ['user', userId],
  },
  ativos: {
    all: () => ['ativos'],
    byId: (ativoId) => ['ativos', ativoId],
    nearby: (params = {}) => ['ativos', 'nearby', params],
    byLocal: (localId) => ['ativos', 'by-local', localId],
    byDate: (date) => ['ativos', 'by-date', date],
  },
  participacoes: {
    all: () => ['participacoes'],
    byUser: (userId) => ['participacoes', 'by-user', userId],
    byAtivo: (ativoId) => ['participacoes', 'by-ativo', ativoId],
    currentUserForAtivo: (ativoId) => ['participacoes', 'current-user', ativoId],
  },
  locais: {
    all: () => ['locais'],
    byId: (localId) => ['locais', localId],
    trending: () => ['locais', 'trending'],
    search: (params = {}) => ['locais', 'search', params],
  },
  zeladorias: {
    all: () => ['zeladorias'],
    byId: (zeladoriaId) => ['zeladorias', zeladoriaId],
    byLocal: (localId) => ['zeladorias', 'by-local', localId],
  },
  retrospectiva: {
    byUserAndPeriod: (userId, periodoInicio, periodoFim) => [
      'retrospectiva',
      userId,
      periodoInicio,
      periodoFim,
    ],
  },
  agenda: {
    byUser: (userId, params = {}) => ['agenda', userId, params],
  },
};

export const legacyQueryKeys = new Set([
  'atividades',
  'courts',
  'bookings',
  'repairs',
  'lobby',
]);

export function assertOfficialQueryKey(queryKey) {
  const rootKey = Array.isArray(queryKey) ? queryKey[0] : queryKey;

  if (legacyQueryKeys.has(rootKey)) {
    throw new Error(`Query key legada bloqueada em modulo novo: ${rootKey}`);
  }

  return queryKey;
}
