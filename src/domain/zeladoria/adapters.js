import { createZeladoria } from '@/domain/zeladoria/model';

const statusMap = {
  pendente: 'aberto',
  aberto: 'aberto',
  em_andamento: 'em_analise',
  em_analise: 'em_analise',
  concluido: 'resolvido',
  resolvido: 'resolvido',
  cancelado: 'arquivado',
  arquivado: 'arquivado',
};

export function repairRequestToZeladoria(request = {}) {
  return createZeladoria({
    id: request.id,
    criadorId: request.criadorId ?? request.requester_id ?? 'user-pendente',
    localId: request.localId ?? request.court_id ?? 'local-pendente',
    titulo: request.titulo ?? request.title ?? '',
    tipo: request.tipo ?? request.priority,
    descricao: request.descricao ?? request.description ?? '',
    fotos: request.fotos ?? (request.image_url ? [request.image_url] : undefined),
    status: statusMap[request.status] ?? 'aberto',
    dataCriacao: request.dataCriacao ?? request.created_date,
    dataResolucao: request.dataResolucao,
    createdAt: request.createdAt ?? request.created_date,
    updatedAt: request.updatedAt ?? request.updated_date ?? request.created_date,
  });
}
