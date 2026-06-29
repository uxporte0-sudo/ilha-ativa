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
    configuracoesPrivacidade: {
      perfilPublico: data.configuracoesPrivacidade?.perfilPublico ?? true,
      compartilharRetrospectiva: data.configuracoesPrivacidade?.compartilharRetrospectiva ?? true,
    },
    configuracoesNotificacao: {
      lembreteAtivo: data.configuracoesNotificacao?.lembreteAtivo ?? true,
      novidadesLocais: data.configuracoesNotificacao?.novidadesLocais ?? true,
    },
    idioma: data.idioma ?? 'pt-BR',
    tema: data.tema ?? 'claro',
    isDemo: data.isDemo ?? false,
    isAdmin: data.isAdmin ?? false,
    status: data.status ?? 'ativo',
    createdAt: data.createdAt ?? DEFAULT_CREATED_AT,
    updatedAt: data.updatedAt ?? data.createdAt ?? DEFAULT_CREATED_AT,
  };
}

export function createDemoUser() {
  return createUser({
    id: 'user-demo-admin',
    nome: 'Usuário Demo',
    foto: '',
    email: 'demo@ilhaativa.dev',
    telefone: '(12) 99999-0000',
    dataNascimento: '1990-01-01',
    genero: 'nao_informado',
    bio: 'Conta demonstração do IlhAtiva.',
    preferenciasEsportivas: ['corrida', 'futebol', 'yoga'],
    configuracoesPrivacidade: {
      perfilPublico: true,
      compartilharRetrospectiva: true,
    },
    configuracoesNotificacao: {
      lembreteAtivo: true,
      novidadesLocais: true,
    },
    idioma: 'pt-BR',
    tema: 'claro',
    isDemo: true,
    isAdmin: true,
    status: 'ativo',
  });
}