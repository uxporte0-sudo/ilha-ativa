# IlhAtiva - Arquitetura de Páginas

## Princípio de Navegação

O Ativo é a entidade central do produto.

Por esse motivo, a criação de Ativos deve ser acessível de diferentes pontos da experiência.

A página "Criar Ativo" não deve ser tratada como uma funcionalidade isolada, mas como um fluxo transversal que pode ser iniciado por múltiplos contextos.

### Pontos de entrada para Criar Ativo

Home
→ Criar Ativo

Agenda
→ Criar Ativo com data pré-preenchida

Mapa
→ Criar Ativo com local pré-preenchido

---

# Onboarding

## Objetivo

Entender os interesses esportivos do usuário e personalizar a experiência inicial.

## Conteúdo

* Boas-vindas
* Seleção de modalidades esportivas
* Preferências de descoberta
* Convite para conectar amigos

## Resultado

Perfil configurado para recomendações.

---

# Login e Cadastro

## Objetivo

Autenticar o usuário.

## Conteúdo

* Login
* Cadastro
* Recuperação de acesso

## Resultado

Acesso à plataforma.

---

# Home

## Objetivo

Descobrir oportunidades esportivas.

A Home é a principal porta de entrada do produto.

## Conteúdo

* Saudação
* Busca global
* Próximos de você
* Baseado nos seus interesses
* Locais em alta
* Ativos em destaque

## Ação Principal

Criar Ativo

A criação deve estar disponível através do botão central da navegação principal.

## Resultado

Usuário encontra ou cria oportunidades de prática esportiva.

---

# Mapa

## Objetivo

Explorar locais e Ativos geograficamente.

## Conteúdo

* Mapa interativo
* Locais cadastrados
* Ativos próximos
* Filtros
* Busca

## Ações

Visualizar Local

Visualizar Ativo

Criar Ativo em um Local

Quando o usuário selecionar um Local e optar por criar um Ativo, o fluxo deve abrir a tela de criação com o Local já preenchido.

## Resultado

Descoberta espacial de oportunidades esportivas.

---

# Agenda

## Objetivo

Gerenciar compromissos esportivos.

## Conteúdo

* Calendário mensal
* Próximos Ativos
* Histórico recente

## Ações

Visualizar dia

Visualizar Ativo

Criar Ativo em uma data específica

Quando o usuário selecionar um dia do calendário e optar por criar um Ativo, a tela deve abrir com a data previamente preenchida.

## Resultado

Organização temporal da prática esportiva.

---

# Criar Ativo

## Objetivo

Permitir que usuários organizem oportunidades esportivas.

## Entradas Possíveis

Fluxo neutro
→ iniciado pela Home

Fluxo contextual por data
→ iniciado pela Agenda

Fluxo contextual por local
→ iniciado pelo Mapa

## Etapas

1. Informações básicas
2. Modalidade
3. Local
4. Data e horário
5. Participação
6. Revisão
7. Publicação

## Resultado

Novo Ativo publicado na plataforma.

---

# Detalhes do Ativo

## Objetivo

Apresentar informações completas de um Ativo.

## Conteúdo

* Título
* Descrição
* Organizador
* Local
* Data e horário
* Participantes
* Regras
* Recomendações

## Ações

Demonstrar interesse

Confirmar participação

Cancelar participação

Compartilhar

## Resultado

Participação no Ativo.

---

# Zeladoria Comunitária

## Objetivo

Permitir que a comunidade reporte problemas relacionados aos espaços esportivos.

## Conteúdo

* Lista de reportes
* Criação de reporte
* Acompanhamento de status

## Ações

Criar reporte

Visualizar reporte

Acompanhar resolução

## Observação

A Zeladoria não possui integração direta com o fluxo de criação de Ativos.

## Resultado

Melhoria contínua dos espaços utilizados pela comunidade.

---

# Retrospectiva

## Objetivo

Transformar histórico de participação em motivação e reconhecimento.

## Conteúdo

* Ativos realizados
* Modalidades praticadas
* Horas acumuladas
* Locais visitados
* Conquistas
* Estatísticas pessoais

## Ações

Compartilhar retrospectiva

Consultar períodos anteriores

## Resultado

Engajamento e retenção.

---

# Conta

## Objetivo

Gerenciar informações pessoais e preferências.

## Conteúdo

* Dados pessoais
* Preferências esportivas
* Configurações
* Privacidade
* Notificações

## Ações

Editar perfil

Atualizar preferências

Gerenciar conta

## Observação

A Conta não possui integração direta com o fluxo de criação de Ativos.

## Resultado

Gestão da identidade do usuário.

---

# Navegação Principal

A navegação principal deve refletir a centralidade do Ativo.

Estrutura sugerida:

Home
Mapa
Criar Ativo
Agenda
Conta

A ação central da navegação é Criar Ativo.

Essa ação deve possuir destaque visual superior às demais opções do menu.
