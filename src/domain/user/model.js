import { DEFAULT_CREATED_AT } from '@/domain/shared/date';

export function createUser(data = {}) {
  return {
    id: data.id,
    nome: data.nome,
    foto: data.foto,
    email: data.email,
    telefone: data.telefone,
    dataNascimento: data.dataNascimento,
    genero: data.genero,
    bio: data.bio,
    preferenciasEsportivas: data.preferenciasEsportivas ?? [],
    configuracoesPrivacidade: data.configuracoesPrivacidade ?? {},
    configuracoesNotificacao: data.configuracoesNotificacao ?? {},
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}
