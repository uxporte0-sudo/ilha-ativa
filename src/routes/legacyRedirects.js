// LEGACY redirects only. Do not add new product routes here.
// Replaced flows must point to official routes and never to legacy pages.
export const legacyRedirects = [
  { from: '/quadras', to: '/mapa', reason: 'Court deixou de ser entidade central; Mapa é a rota oficial de descoberta espacial.' },
  { from: '/agendar', to: '/ativos/novo', reason: 'Agendamento legado foi substituído pelo fluxo Criar Ativo.' },
  { from: '/reparos/novo', to: '/zeladoria/nova', reason: 'RepairRequest legado foi substituído por Zeladoria comunitária.' },
  { from: '/minhas-solicitacoes', to: '/agenda', reason: 'Solicitações legadas misturavam agenda e zeladoria; sem contexto de domínio na Foundation, Agenda é a rota oficial de organização temporal.' },
  { from: '/perfil', to: '/conta', reason: 'Perfil legado foi substituído por Conta.' },
];
