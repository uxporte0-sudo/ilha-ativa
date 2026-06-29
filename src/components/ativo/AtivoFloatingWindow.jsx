import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AtivoViewer from '@/components/ativo/AtivoViewer';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { UserService } from '@/domain/user/service';
import { SessionService } from '@/domain/user/sessionService';
import { ParticipacaoService } from '@/domain/participacao/service';

export default function AtivoFloatingWindow({ ativoId, onClose }) {
  console.log('[ATIVO_OPEN] AtivoFloatingWindow mounted', { ativoId });

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const ativoQuery = useQuery({
    queryKey: ['ativo', ativoId, 'full'],
    queryFn: async () => {
      const ativo = await AtivoService.getById(ativoId);
      console.log('[ATIVO_OPEN] Ativo loaded', { ativo });
      if (!ativo) return null;

      const [local, organizador, participacoes, session] = await Promise.all([
        ativo.localId ? LocalService.getById(ativo.localId).catch(() => null) : null,
        ativo.organizadorId ? UserService.getById(ativo.organizadorId).catch(() => null) : null,
        ParticipacaoService.listByAtivo(ativoId).catch(() => []),
        SessionService.getSession().catch(() => ({ user: null })),
      ]);

      const activeParticipation = session.user
        ? participacoes.find((p) => p.userId === session.user.id && p.status !== 'cancelado')
        : null;

      const participationActions = ParticipacaoService.getParticipationActions({
        ativo,
        participacao: activeParticipation,
      });

      // Converter objeto de ações para array de strings esperado pelo AtivoViewer
      const actions = [];
      if (participationActions.canDemonstrarInteresse) actions.push('interesse');
      if (participationActions.canConfirmar) actions.push('confirmar');
      if (participationActions.canCancelar) actions.push('cancelar');

      return {
        ativo,
        local,
        organizador,
        participacoes,
        activeParticipation,
        participationActions,
        actions,
      };
    },
    enabled: !!ativoId,
  });

  if (!ativoQuery.data) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4">
        <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-container-secondary shadow-xl sm:rounded-2xl">
          <div className="flex items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold leading-6 text-text-primary">Carregando...</h1>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-base text-text-secondary hover:bg-container-tertiary"
              aria-label="Fechar"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { ativo, local, organizador, participacoes, activeParticipation, participationActions, actions } =
    ativoQuery.data;

  console.log('[ATIVO_OPEN] Rendering AtivoViewer', { ativoId: ativo.id });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-container-secondary shadow-xl sm:rounded-2xl">
        <div className="flex-1 overflow-y-auto">
          <AtivoViewer
            ativo={ativo}
            local={local}
            organizador={organizador}
            participacoes={participacoes}
            activeParticipation={activeParticipation}
            participationActions={participationActions}
            actions={actions}
            isMutating={false}
            onInterest={() => {}}
            onConfirm={() => {}}
            onCancel={() => {}}
            onClose={onClose}
            onRetry={() => ativoQuery.refetch()}
          />
        </div>
      </div>
    </div>
  );
}