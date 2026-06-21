import { createUser } from '@/domain/user/model';

export function legacyUserToUser(legacyUser = {}) {
  return createUser({
    id: legacyUser.id,
    nome: legacyUser.nome ?? legacyUser.full_name ?? '',
    foto: legacyUser.foto ?? legacyUser.avatar_url,
    email: legacyUser.email ?? '',
    telefone: legacyUser.telefone ?? legacyUser.phone,
    dataNascimento: legacyUser.dataNascimento,
    genero: legacyUser.genero,
    bio: legacyUser.bio,
    preferenciasEsportivas: legacyUser.preferenciasEsportivas ?? [],
    configuracoesPrivacidade: legacyUser.configuracoesPrivacidade ?? {},
    configuracoesNotificacao: legacyUser.configuracoesNotificacao ?? {},
    createdAt: legacyUser.createdAt ?? legacyUser.created_date,
    updatedAt: legacyUser.updatedAt ?? legacyUser.updated_date ?? legacyUser.created_date,
  });
}
