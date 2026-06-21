import AppScreen from '@/components/layout/AppScreen';
import PageTitle from '@/components/layout/PageTitle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const routeDescriptions = {
  home: 'Placeholder da Home. A descoberta definitiva será implementada em fase futura.',
  mapa: 'Placeholder do Mapa. A descoberta espacial definitiva será implementada em fase futura.',
  agenda: 'Placeholder da Agenda. O calendário definitivo será implementado em fase futura.',
  criarAtivo: 'Placeholder de Criar Ativo. O fluxo definitivo será implementado em fase futura.',
  ativoDetalhes: 'Placeholder de Detalhes do Ativo. Participação real será implementada em fase futura.',
  local: 'Placeholder de Local. A ficha definitiva será implementada em fase futura.',
  zeladoria: 'Placeholder de Zeladoria. O fluxo comunitário definitivo será implementado em fase futura.',
  retrospectiva: 'Placeholder de Retrospectiva. Métricas reais serão implementadas em fase futura.',
  conta: 'Placeholder de Conta. Gestão de dados será implementada em fase futura.',
  login: 'Placeholder de Login. Autenticação funcional será implementada em fase futura.',
  cadastro: 'Placeholder de Cadastro. Criação de conta será implementada em fase futura.',
  onboarding: 'Placeholder de Onboarding. Preferências iniciais serão implementadas em fase futura.',
  notFound: 'Rota não encontrada na spec oficial.',
};

export default function SpecPlaceholder({ title, spec, route, variant = 'default', showBack = false }) {
  return (
    <AppScreen variant={variant}>
      <PageTitle title={title} description={routeDescriptions[spec]} showBack={showBack} />
      <div className="rounded-[var(--radius-card)] border border-borderSemantic-subtle bg-container-primary p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Badge variant="secondary">Fase 1</Badge>
          <span className="text-xs font-semibold text-text-tertiary">{route}</span>
        </div>
        <p className="text-sm leading-6 text-text-secondary">
          Esta tela confirma a rota, o AppShell, o AppScreen e a navegação principal. O conteúdo de domínio fica reservado para as próximas fases da spec.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/">Home</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to="/ativos/novo">Criar Ativo</Link>
        </Button>
      </div>
    </AppScreen>
  );
}
