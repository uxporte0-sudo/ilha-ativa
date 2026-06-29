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
    configuracoesPrivacidade: {
      perfilPublico: legacyUser.configuracoesPrivacidade?.perfilPublico ?? true,
      compartilharRetrospectiva: legacyUser.configuracoesPrivacidade?.compartilharRetrospectiva ?? true,
    },
    configuracoesNotificacao: {
      lembreteAtivo: legacyUser.configuracoesNotificacao?.lembreteAtivo ?? true,
      novidadesLocais: legacyUser.configuracoesNotificacao?.novidadesLocais ?? true,
    },
    idioma: legacyUser.idioma ?? 'pt-BR',
    tema: legacyUser.tema ?? 'claro',
    isDemo: legacyUser.isDemo ?? false,
    isAdmin: legacyUser.isAdmin ?? false,
    status: legacyUser.status ?? 'ativo',
    createdAt: legacyUser.createdAt ?? legacyUser.created_date,
    updatedAt: legacyUser.updatedAt ?? legacyUser.updated_date ?? legacyUser.created_date,
  });
}