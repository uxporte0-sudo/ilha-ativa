import { createParticipacao } from '@/domain/participacao/model';

export function atividadeConfirmadosToParticipacoes(atividade = {}) {
  const usuariosConfirmados = atividade.confirmadosUsuarios ?? [];

  return usuariosConfirmados.map((userId) =>
    createParticipacao({
      id: `${atividade.id}-participacao-${userId}`,
      ativoId: atividade.id,
      userId,
      status: 'confirmado',
      dataConfirmacao: atividade.updated_date ?? atividade.created_date,
      createdAt: atividade.created_date,
      updatedAt: atividade.updated_date ?? atividade.created_date,
    })
  );
}
