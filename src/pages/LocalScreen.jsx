import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AtivoService } from '@/domain/ativo/service';
import { LocalService } from '@/domain/local/service';
import { assertOfficialQueryKey, queryKeys } from '@/domain/shared/queryKeys';
import LocalViewer from '@/components/local/LocalViewer';
import AppScreen from '@/components/layout/AppScreen';

function LocalLoading() {
  return (
    <AppScreen className="gap-5" variant="warm">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-36 w-full rounded-[var(--radius-card)]" />
      <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
    </AppScreen>
  );
}

export default function LocalScreen() {
  const { localId } = useParams();
  const localQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.locais.byId(localId)),
    queryFn: () => LocalService.getById(localId),
    enabled: Boolean(localId),
  });
  const ativosQuery = useQuery({
    queryKey: assertOfficialQueryKey(queryKeys.ativos.byLocal(localId)),
    queryFn: () => AtivoService.listByLocal(localId),
    enabled: Boolean(localId),
  });
  if (localQuery.isLoading || ativosQuery.isLoading) return <LocalLoading />;
  if (localQuery.isError || ativosQuery.isError || !localQuery.data) {
    return (<LocalViewer local={null} ativos={[]} onRetry={() => { localQuery.refetch(); ativosQuery.refetch(); }} />);
  }
  return (<LocalViewer local={localQuery.data} ativos={ativosQuery.data ?? []} onRetry={() => { localQuery.refetch(); ativosQuery.refetch(); }} />);
}
