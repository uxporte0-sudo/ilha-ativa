import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { ParticipacaoService } from '@/domain/participacao/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import { UserService } from '@/domain/user/service';
import { SessionService } from '@/domain/user/sessionService';
import AtivoViewer from '@/components/ativo/AtivoViewer';
import AppScreen from '@/components/layout/AppScreen';

function AtivoDetailsLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-64 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

export default function AtivoDetailsScreen() {
  const { ativoId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const sessionQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.session),
    queryFn: () => SessionService.get(),
  });
  const ativoQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativo.byId(ativoId)),
    queryFn: () => AtivoService.getById(ativoId),
    enabled: !!ativoId,
  });
  const localQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.local.byId(ativoQuery.data?.localId)),
    queryFn: () => LocalService.getById(ativoQuery.data?.localId),
    enabled: !!ativoQuery.data?.localId,
  });
  const organizadorQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.user.byId(ativoQuery.data?.organizadorId)),
    queryFn: () => UserService.getById(ativoQuery.data?.organizadorId),
    enabled: !!ativoQuery.data?.organizadorId,
  });
  const participacoesQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacoes.byAtivoId(ativoId)),
    queryFn: () => ParticipacaoService.getByAtivoId(ativoId),
    enabled: !!ativoId,
  });
  const participacaoUsuarioQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.participacao.byUserAtivo(sessionQuery.data?.id, ativoId)),
    queryFn: () => ParticipacaoService.getByUserAndAtivo(sessionQuery.data?.id, ativoId),
    enabled: !!sessionQuery.data?.id && !!ativoId,
  });
  const ativo = ativoQuery.data;
  const participacoes = participacoesQuery.data ?? [];
  const activeParticipation = useMemo(() => {
    if (!sessionQuery.data?.id || !participacoes.length) return null;
    return participacoes.find((p) => p.userId === sessionQuery.data?.id) ?? null;
  }, [participacoes, sessionQuery.data?.id]);
  const participationActions = useMemo(() => {
    const service = new ParticipacaoService();
    return service.getParticipationActions(activeParticipation?.status);
  }, [activeParticipation?.status]);
  const invalidateParticipationData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacoes.byAtivoId(ativoId)) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.participacao.byUserAtivo(sessionQuery.data?.id, ativoId)) }),
      queryClient.invalidateQueries({ queryKey: assertOfficialQueryKey(queryKeys.ativo.byId(ativoId)) }),
    ]);
  };
  const participationMutation = useMutation({
    mutationFn: async (action) => {
      if (action === 'interesse') return ParticipacaoService.demonstrarInteresse(sessionQuery.data?.id, ativoId, ativo);
      if (action === 'confirmar') return ParticipacaoService.confirmar(sessionQuery.data?.id, ativoId, ativo);
      return ParticipacaoService.cancelar(sessionQuery.data?.id, ativoId, ativo);
    },
    onSuccess: async (_, action) => {
      await invalidateParticipationData();
      toast({ title: 'Participacao atualizada', description: action === 'cancelar' ? 'Seu vinculo foi cancelado.' : 'Seu vinculo foi salvo nos dados oficiais.' });
    },
    onError: (error) => {
      toast({ title: 'Participacao nao atualizada', description: error.message ?? 'Nao foi possivel concluir a acao.', variant: 'destructive' });
    },
  });
  const isLoading = sessionQuery.isLoading || ativoQuery.isLoading || localQuery.isLoading || organizadorQuery.isLoading || participacoesQuery.isLoading || participacaoUsuarioQuery.isLoading;
  const hasError = sessionQuery.isError || ativoQuery.isError || localQuery.isError || organizadorQuery.isError || participacoesQuery.isError || participacaoUsuarioQuery.isError;

  if (!ativoId) {
    return (<AtivoViewer ativo={null} local={null} organizador={null} participacoes={[]} activeParticipation={null} participationActions={[]} isMutating={false} onInterest={() => {}} onConfirm={() => {}} onCancel={() => {}} notFound />);
  }
  if (isLoading) return <AtivoDetailsLoading />;
  if (hasError) {
    return (<AtivoViewer ativo={null} local={null} organizador={null} participacoes={[]} activeParticipation={null} participationActions={[]} isMutating={false} onInterest={() => {}} onConfirm={() => {}} onCancel={() => {}} error />);
  }
  return (<AtivoViewer ativo={ativo} local={localQuery.data} organizador={organizadorQuery.data} participacoes={participacoes} activeParticipation={activeParticipation} participationActions={participationActions} isMutating={participationMutation.isPending} onInterest={() => participationMutation.mutate('interesse')} onConfirm={() => participationMutation.mutate('confirmar')} onCancel={() => participationMutation.mutate('cancelar')} />);
}
