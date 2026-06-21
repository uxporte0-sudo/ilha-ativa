# IlhAtiva - Screen Manifest

Este documento transforma `ARCHITECTURE_MANIFEST.md` e `DESIGN_MANIFEST.md` em especificações executáveis de tela.

Cada seção descreve o contrato mínimo para implementação, validação e navegação. Quando houver divergência entre este documento e o legado, prevalecem os manifests oficiais de arquitetura e design.

## 1. Home

### Identificação

- Nome: Home
- Rota: `/`
- Objetivo: servir como porta de entrada para descoberta de Ativos, recomendações personalizadas, Locais em alta e acesso rápido à criação de Ativo.

### Entidades utilizadas

- User
- Ativo
- Local
- Participacao

### Dados necessários

- `usuarioAtual`
- `proximosAtivos`
- `ativosRecomendados`
- `ativosEmDestaque`
- `locaisEmAlta`
- `preferenciasUsuario`
- `participacoesUsuario`

### Componentes utilizados

- `AppScreen`
- `Header`
- `SearchField`
- `AtivoHomeCard`
- `LocalCard`
- `Button`
- `MainMenu`
- `CreateAtivoAction`
- `Badge`

### Estados

- `loading`: exibir estrutura base com placeholders para seções e cards.
- `empty`: exibir CTA para Criar Ativo e mensagem simples quando não houver recomendações.
- `success`: exibir seções de Ativos próximos, recomendações e Locais em alta.
- `error`: exibir mensagem de falha e ação para tentar carregar novamente.

### Ações possíveis

- `buscarAtivosELocais`
- `abrirAtivo`
- `abrirLocal`
- `abrirMapa`
- `abrirAgenda`
- `abrirConta`
- `criarAtivo`
- `verTodosAtivos`
- `verTodosLocais`

### Fluxos de entrada

- Login
- Cadastro
- Preferências
- Menu principal
- Detalhes do Ativo
- Criar Ativo publicado

### Fluxos de saída

- Mapa
- Local
- Agenda
- Criar Ativo
- Detalhes do Ativo
- Conta

### Regras de negócio

- Recomendações devem considerar `preferenciasEsportivas` do User.
- Cards de Ativo devem usar o mesmo modelo visual usado em outros contextos de descoberta.
- Criar Ativo deve ter destaque visual maior que CTAs secundários.
- Termos legados como Booking, Court e Event não devem aparecer na UI.
- Locais em alta devem abrir ficha de Local, não uma tela de quadra legada.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: sim.
- Fluxo neutro: sim, via CTA principal ou botão central do menu.
- Fluxo com local: não diretamente, exceto se o usuário selecionar um Local antes.
- Fluxo com data: não diretamente.

### Critério de implementação

- Renderiza Home em layout mobile-first 412px.
- Exibe pelo menos uma seção de Ativos e uma de Locais.
- Permite abrir Detalhes do Ativo a partir de cards.
- Permite abrir Local a partir de cards.
- Disponibiliza Criar Ativo com fluxo neutro.
- Usa `MainMenu` com Criar Ativo como ação central.
- Trata `loading`, `empty`, `success` e `error`.

## 2. Mapa

### Identificação

- Nome: Mapa
- Rota: `/mapa`
- Objetivo: permitir descoberta espacial de Locais e Ativos próximos, alternando entre mapa, busca e lista.

### Entidades utilizadas

- Local
- Ativo
- User
- Participacao

### Dados necessários

- `locais`
- `ativosProximos`
- `localSelecionado`
- `ativoSelecionado`
- `filtrosMapa`
- `termoBusca`
- `localizacaoUsuario`

### Componentes utilizados

- `AppScreen`
- `SearchField`
- `MapMarker`
- `LocalListCard`
- `AtivoHorizontalCard`
- `MainMenu`
- `Button`
- `Badge`

### Estados

- `loading`: exibir mapa ou skeleton de mapa com busca disponível.
- `empty`: exibir mapa sem marcadores e opção para limpar filtros ou criar Ativo.
- `success`: exibir marcadores, busca e alternância mapa/lista.
- `error`: exibir falha de carregamento ou indisponibilidade de localização.

### Ações possíveis

- `buscarNoMapa`
- `filtrarLocais`
- `selecionarLocal`
- `selecionarAtivo`
- `abrirLocal`
- `abrirAtivo`
- `alternarListaMapa`
- `criarAtivoComLocal`
- `abrirZeladoriaComLocal`

### Fluxos de entrada

- Home
- MainMenu
- Local
- Criar Ativo cancelado ou concluído

### Fluxos de saída

- Local
- Detalhes do Ativo
- Criar Ativo
- Zeladoria
- Home
- Agenda
- Conta

### Regras de negócio

- Selecionar marcador de Local deve abrir contexto de Local.
- Selecionar marcador de Ativo deve permitir abrir Detalhes do Ativo.
- A visualização em lista deve usar os mesmos Locais e filtros do mapa.
- Criar Ativo a partir de Local deve preencher `localId`.
- A busca pode procurar Locais, modalidades e Ativos, mas deve usar vocabulário oficial.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: sim.
- Fluxo neutro: sim, pelo botão central do menu quando nenhum Local estiver selecionado.
- Fluxo com local: sim, quando iniciado a partir de marcador, lista ou ficha contextual de Local.
- Fluxo com data: não.

### Critério de implementação

- Exibe mapa como superfície principal.
- Exibe busca no topo.
- Renderiza marcadores de Local e/ou Ativo.
- Permite alternar para lista de Locais.
- Abre ficha de Local.
- Inicia Criar Ativo com `localId` quando houver Local selecionado.
- Trata `loading`, `empty`, `success` e `error`.

## 3. Local

### Identificação

- Nome: Local
- Rota: `/locais/:localId`
- Objetivo: apresentar detalhes de um Local, Ativos relacionados e ações contextuais de Criar Ativo e Zeladoria.

### Entidades utilizadas

- Local
- Ativo
- Zeladoria
- User

### Dados necessários

- `local`
- `ativosDoLocal`
- `zeladoriasDoLocal`
- `estruturaLocal`
- `acessibilidadeLocal`
- `fotosLocal`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `SearchField`
- `LocalCard`
- `AtivoHorizontalCard`
- `Button`
- `Badge`
- `MainMenu`
- `MapMarker`

### Estados

- `loading`: exibir título e placeholders de detalhes.
- `empty`: exibir Local sem Ativos futuros e CTA para Criar Ativo.
- `success`: exibir dados do Local, Ativos relacionados e ações contextuais.
- `error`: exibir erro quando `localId` não existir ou falhar ao carregar.

### Ações possíveis

- `abrirAtivo`
- `criarAtivoComLocal`
- `reportarZeladoriaComLocal`
- `voltarMapa`
- `compartilharLocal`

### Fluxos de entrada

- Mapa
- Home
- Zeladoria
- Criar Ativo

### Fluxos de saída

- Mapa
- Detalhes do Ativo
- Criar Ativo
- Zeladoria

### Regras de negócio

- Local deve sempre ser representado como espaço físico onde Ativos acontecem.
- CTA principal da ficha deve ser Criar Ativo com `localId`.
- Zeladoria iniciada pelo Local deve receber `localId`.
- Ativos cancelados não devem aparecer como oportunidades principais.
- Se não houver Ativos futuros, a tela deve incentivar criação contextual.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: sim.
- Fluxo neutro: não.
- Fluxo com local: sim, com `localId` pré-preenchido.
- Fluxo com data: não.

### Critério de implementação

- Carrega Local por `localId`.
- Exibe nome, endereço, categoria, estrutura e acessibilidade quando disponíveis.
- Lista Ativos relacionados ao Local.
- Permite Criar Ativo com Local preenchido.
- Permite iniciar Zeladoria com Local preenchido.
- Trata `loading`, `empty`, `success` e `error`.

## 4. Agenda

### Identificação

- Nome: Agenda
- Rota: `/agenda`
- Objetivo: organizar a prática esportiva do usuário no tempo, exibindo calendário, Ativos do dia, próximos Ativos e histórico recente.

### Entidades utilizadas

- User
- Ativo
- Participacao
- Retrospectiva

### Dados necessários

- `usuarioAtual`
- `mesSelecionado`
- `diaSelecionado`
- `ativosDoDia`
- `proximosAtivos`
- `participacoesUsuario`
- `historicoRecente`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `CalendarMonth`
- `AtivoCalendarMarker`
- `AtivoHorizontalCard`
- `Button`
- `MainMenu`
- `Badge`

### Estados

- `loading`: exibir calendário e lista em skeleton.
- `empty`: exibir dia ou mês sem Ativos e CTA para Criar Ativo com data.
- `success`: exibir calendário, marcadores e listas temporais.
- `error`: exibir falha ao carregar agenda.

### Ações possíveis

- `selecionarDia`
- `mudarMes`
- `abrirAtivo`
- `criarAtivoComData`
- `abrirRetrospectiva`
- `cancelarParticipacao`

### Fluxos de entrada

- Home
- MainMenu
- Detalhes do Ativo
- Retrospectiva
- Criar Ativo publicado

### Fluxos de saída

- Detalhes do Ativo
- Criar Ativo
- Retrospectiva
- Home
- Mapa
- Conta

### Regras de negócio

- Ativos confirmados pelo User devem ter destaque maior que oportunidades sugeridas.
- Selecionar um dia deve filtrar Ativos daquele dia.
- Criar Ativo a partir de dia selecionado deve preencher `date`.
- Participações canceladas não devem aparecer como compromisso ativo.
- Histórico recente deve alimentar Retrospectiva quando Participacao estiver com status `participou`.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: sim.
- Fluxo neutro: sim, pelo botão central do menu se nenhum dia estiver selecionado.
- Fluxo com local: não.
- Fluxo com data: sim, com `date` derivado do dia selecionado.

### Critério de implementação

- Exibe calendário mensal com dia selecionável.
- Marca dias com Ativos.
- Lista Ativos do dia ou próximos Ativos.
- Permite abrir Detalhes do Ativo.
- Permite Criar Ativo com `date`.
- Trata `loading`, `empty`, `success` e `error`.

## 5. Criar Ativo

### Identificação

- Nome: Criar Ativo
- Rota: `/ativos/novo`
- Objetivo: permitir criação guiada de novo Ativo, aceitando contexto opcional de origem por Local, data e modalidade.

### Entidades utilizadas

- Ativo
- Local
- User
- Participacao

### Dados necessários

- `usuarioAtual`
- `rascunhoAtivo`
- `locaisDisponiveis`
- `modalidadesDisponiveis`
- `localId`
- `date`
- `modalidade`
- `origemFluxo`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `ProgressIcon`
- `ProgressBar`
- `TextField`
- `Button`
- `Switch`
- `PublicPrivateSwitch`
- `AtivoFormBasicInfo`
- `AtivoFormModality`
- `AtivoFormLocation`
- `AtivoFormDateTime`
- `AtivoFormParticipation`
- `ReviewCard`

### Estados

- `loading`: carregar dados contextuais e listas de Local/modalidade.
- `empty`: não se aplica ao fluxo principal; usar estado de formulário inicial.
- `success`: formulário válido, revisão pronta ou Ativo publicado.
- `error`: erro de validação, falha de publicação ou contexto inválido.

### Ações possíveis

- `preencherInformacoesBasicas`
- `selecionarModalidade`
- `selecionarLocal`
- `definirDataHora`
- `definirParticipacao`
- `alterarPrivacidade`
- `avancarEtapa`
- `voltarEtapa`
- `revisarAtivo`
- `publicarAtivo`
- `abrirAtivoPublicado`

### Fluxos de entrada

- Home
- MainMenu
- Mapa
- Local
- Agenda

### Fluxos de saída

- Detalhes do Ativo
- Home
- Mapa
- Local
- Agenda

### Regras de negócio

- Ativo só pode ser publicado com organizador, modalidade, Local, data de início e data de fim.
- `dataHoraFim` deve ser posterior a `dataHoraInicio`.
- `minimoParticipantes` deve ser maior que zero.
- `maximoParticipantes`, quando informado, deve ser maior ou igual ao mínimo.
- Publicação só ocorre após etapa de revisão.
- Campo Local deve ser editável mesmo quando pré-preenchido.
- Campo Data deve ser editável mesmo quando pré-preenchido.
- Ativo publicado deve abrir Detalhes do Ativo.
- Ativo criado pelo User deve aparecer na Agenda e em recomendações quando relevante.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: é a própria tela.
- Fluxo neutro: sim, sem `localId` ou `date`.
- Fluxo com local: sim, por query param `localId`.
- Fluxo com data: sim, por query param `date`.

### Critério de implementação

- Aceita query params `localId`, `date` e `modalidade`.
- Pré-preenche dados contextuais sem bloquear edição.
- Valida campos obrigatórios.
- Exibe progressão de etapas ou equivalente visual.
- Exibe revisão antes da publicação.
- Publica Ativo com status inicial coerente.
- Redireciona para `/ativos/:ativoId` após publicação.
- Trata `loading`, `success` e `error`.

## 6. Detalhes do Ativo

### Identificação

- Nome: Detalhes do Ativo
- Rota: `/ativos/:ativoId`
- Objetivo: apoiar decisão e participação, apresentando informações completas do Ativo e ações de Participacao.

### Entidades utilizadas

- Ativo
- Local
- User
- Participacao

### Dados necessários

- `ativo`
- `local`
- `organizador`
- `participantes`
- `participacaoUsuario`
- `recomendacoesAtivo`
- `quorum`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `Badge`
- `Avatar`
- `Button`
- `LocalCard`
- `AtivoHorizontalCard`
- `MainMenu`

### Estados

- `loading`: exibir estrutura da página e placeholders.
- `empty`: não se aplica quando `ativoId` é válido; usar erro para não encontrado.
- `success`: exibir dados completos e ações conforme status.
- `error`: exibir Ativo não encontrado ou falha de carregamento.

### Ações possíveis

- `demonstrarInteresse`
- `confirmarParticipacao`
- `cancelarParticipacao`
- `compartilharAtivo`
- `abrirLocal`
- `abrirAgenda`
- `voltar`

### Fluxos de entrada

- Home
- Agenda
- Mapa
- Local
- Criar Ativo publicado
- Compartilhamento externo

### Fluxos de saída

- Agenda
- Local
- Home
- Mapa
- Compartilhamento externo

### Regras de negócio

- Um User não pode ter mais de uma Participacao ativa no mesmo Ativo.
- Confirmar Participacao cria ou atualiza Participacao com status `confirmado`.
- Cancelar Participacao muda status para `cancelado`.
- Ativos cancelados não devem permitir nova confirmação.
- Ativos realizados podem exibir informação histórica, mas não CTA de participação.
- Participacao confirmada deve refletir na Agenda.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não como ação primária da tela.
- Fluxo neutro: apenas pelo MainMenu, se visível.
- Fluxo com local: opcional futuro, não obrigatório.
- Fluxo com data: não.

### Critério de implementação

- Carrega Ativo por `ativoId`.
- Exibe título, descrição, modalidade, Local, data, horário, organizador, participantes e regras.
- Permite demonstrar interesse, confirmar e cancelar Participacao conforme estado.
- Atualiza Agenda após confirmação.
- Permite compartilhar Ativo.
- Trata `loading`, `success` e `error`.

## 7. Zeladoria

### Identificação

- Nome: Zeladoria
- Rotas: `/zeladoria`, `/zeladoria/nova`, `/zeladoria/:zeladoriaId`
- Objetivo: permitir criação e acompanhamento de reportes comunitários relacionados a Locais.

### Entidades utilizadas

- Zeladoria
- Local
- User

### Dados necessários

- `usuarioAtual`
- `zeladorias`
- `zeladoriaAtual`
- `locaisDisponiveis`
- `localId`
- `rascunhoZeladoria`
- `fotosSelecionadas`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `ProgressIcon`
- `ProgressBar`
- `TextField`
- `PhotoUploader`
- `Button`
- `LocalCard`
- `Card`
- `MainMenu`

### Estados

- `loading`: carregar lista, detalhe ou contexto de Local.
- `empty`: exibir ausência de reportes e opção de criar Zeladoria.
- `success`: exibir lista, detalhe ou formulário preenchível.
- `error`: falha ao carregar, validar ou enviar reporte.

### Ações possíveis

- `listarZeladorias`
- `iniciarZeladoria`
- `selecionarLocal`
- `descreverProblema`
- `adicionarFoto`
- `removerFoto`
- `continuarRevisao`
- `abrirZeladoria`
- `voltar`

### Fluxos de entrada

- Home
- MainMenu
- Mapa
- Local
- Revisar Zeladoria

### Fluxos de saída

- Revisar Zeladoria
- Local
- Mapa
- Home

### Regras de negócio

- Toda Zeladoria deve estar associada a um Local.
- Quando iniciada por Local ou Mapa, `localId` deve vir pré-preenchido.
- O usuário deve revisar dados antes de enviar.
- Fotos são opcionais, salvo decisão futura explícita.
- Status inicial após envio deve ser `aberto`.
- Zeladoria é fluxo comunitário, não administrativo.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não.
- Fluxo neutro: não.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe lista ou formulário de Zeladoria conforme rota.
- Permite criar reporte com descrição, Local e fotos.
- Aceita `localId` opcional na rota de nova Zeladoria.
- Valida associação com Local.
- Encaminha para Revisar Zeladoria antes do envio.
- Trata `loading`, `empty`, `success` e `error`.

## 8. Revisar Zeladoria

### Identificação

- Nome: Revisar Zeladoria
- Rota: etapa interna de `/zeladoria/nova`
- Objetivo: confirmar dados do reporte antes do envio definitivo.

### Entidades utilizadas

- Zeladoria
- Local
- User

### Dados necessários

- `rascunhoZeladoria`
- `local`
- `fotosSelecionadas`
- `usuarioAtual`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `ProgressIcon`
- `ProgressBar`
- `ZeladoriaReviewCard`
- `ReviewCard`
- `Button`

### Estados

- `loading`: validar rascunho e carregar Local.
- `empty`: exibir retorno ao formulário se não houver rascunho.
- `success`: exibir revisão agrupada por problema, Local e fotos.
- `error`: erro de envio ou rascunho inválido.

### Ações possíveis

- `enviarZeladoria`
- `voltarEditar`
- `removerFoto`
- `cancelar`

### Fluxos de entrada

- Zeladoria

### Fluxos de saída

- Zeladoria enviada
- Zeladoria edição
- Local
- Mapa

### Regras de negócio

- Envio só pode ocorrer se houver descrição do problema e Local.
- Após envio, a Zeladoria deve receber status `aberto`.
- Botão primário deve ser ENVIAR REPORT ou texto equivalente definido pelo produto.
- Voltar e editar não deve perder o rascunho.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não.
- Fluxo neutro: não.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe resumo do problema, Local e fotos.
- Permite voltar para edição preservando dados.
- Envia reporte e cria Zeladoria com status `aberto`.
- Exibe confirmação ou encaminha para acompanhamento.
- Trata `loading`, `empty`, `success` e `error`.

## 9. Retrospectiva

### Identificação

- Nome: Retrospectiva
- Rota: `/retrospectiva`
- Objetivo: transformar histórico de participação em resumo motivacional com métricas, conquistas e compartilhamento.

### Entidades utilizadas

- Retrospectiva
- User
- Participacao
- Ativo
- Local

### Dados necessários

- `usuarioAtual`
- `periodoSelecionado`
- `retrospectiva`
- `ativosParticipados`
- `modalidadesPraticadas`
- `horasAtivas`
- `locaisVisitados`
- `novosContatos`
- `conquistas`
- `comparativos`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `RetrospectiveMetric`
- `RetrospectiveMetricCard`
- `Avatar`
- `Badge`
- `Button`
- `MainMenu`

### Estados

- `loading`: exibir skeleton de métricas.
- `empty`: exibir mensagem de incentivo quando não houver Participações no período.
- `success`: exibir métricas, modalidades, comunidade, evolução e conquistas.
- `error`: falha ao consolidar dados.

### Ações possíveis

- `alterarPeriodo`
- `compartilharRetrospectiva`
- `abrirAtivoHistorico`
- `abrirAgenda`
- `abrirConta`

### Fluxos de entrada

- Conta
- Agenda
- MainMenu

### Fluxos de saída

- Agenda
- Conta
- Detalhes do Ativo
- Compartilhamento externo

### Regras de negócio

- Retrospectiva deve considerar apenas Participações com status `participou`.
- Ativos confirmados, interessados ou cancelados não contam como participação efetiva.
- Métricas devem respeitar o período selecionado.
- Compartilhamento deve usar resumo visual e não expor dados privados além das configurações do User.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não como ação da tela.
- Fluxo neutro: apenas pelo MainMenu, se visível.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Consolida dados por período.
- Exibe Ativos participados, modalidades, horas ativas, Locais visitados e conquistas.
- Trata ausência de histórico com estado motivacional.
- Permite compartilhar Retrospectiva.
- Trata `loading`, `empty`, `success` e `error`.

## 10. Conta

### Identificação

- Nome: Conta
- Rota: `/conta`
- Objetivo: permitir gestão de identidade, dados pessoais, preferências esportivas, privacidade e notificações.

### Entidades utilizadas

- User
- Retrospectiva

### Dados necessários

- `usuarioAtual`
- `dadosPessoais`
- `preferenciasEsportivas`
- `configuracoesPrivacidade`
- `configuracoesNotificacao`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `AccountForm`
- `PreferencesSelector`
- `TextField`
- `Switch`
- `Button`
- `Avatar`
- `MainMenu`

### Estados

- `loading`: carregar dados do User.
- `empty`: não se aplica a usuário autenticado; redirecionar para Login se necessário.
- `success`: exibir formulário de conta e atalhos.
- `error`: erro ao carregar ou salvar dados.

### Ações possíveis

- `editarDadosPessoais`
- `salvarConta`
- `alterarPreferencias`
- `alterarPrivacidade`
- `alterarNotificacoes`
- `abrirRetrospectiva`
- `sair`

### Fluxos de entrada

- Home
- MainMenu
- Retrospectiva
- Login

### Fluxos de saída

- Home
- Preferências
- Retrospectiva
- Login

### Regras de negócio

- Alterações em `preferenciasEsportivas` devem afetar recomendações da Home.
- Salvar deve validar campos obrigatórios do User.
- Dados de privacidade devem ser usados por Retrospectiva e compartilhamento.
- Conta não deve iniciar Criar Ativo diretamente, salvo pelo MainMenu global.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não como ação da tela.
- Fluxo neutro: apenas pelo MainMenu, se visível.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe e edita dados principais do User.
- Permite atualizar preferências esportivas.
- Permite configurar privacidade e notificações.
- Salva alterações com feedback.
- Abre Retrospectiva.
- Trata `loading`, `success` e `error`.

## 11. Login

### Identificação

- Nome: Login
- Rota: `/login`
- Objetivo: autenticar User e encaminhar para Home ou fluxos iniciais.

### Entidades utilizadas

- User

### Dados necessários

- `credenciais`
- `sessaoAtual`
- `provedoresSociais`
- `erroAutenticacao`

### Componentes utilizados

- `AppScreen`
- `Logo`
- `TextField`
- `Button`

### Estados

- `loading`: autenticação em andamento.
- `empty`: formulário inicial.
- `success`: sessão criada e redirecionamento.
- `error`: credenciais inválidas ou falha de autenticação.

### Ações possíveis

- `entrar`
- `abrirCadastro`
- `recuperarSenha`
- `entrarComGoogle`
- `entrarComFacebook`

### Fluxos de entrada

- Onboarding
- Cadastro
- Sessão expirada
- Rota protegida sem autenticação

### Fluxos de saída

- Home
- Cadastro
- Preferências
- Recuperação de acesso

### Regras de negócio

- User autenticado não deve permanecer na tela de Login.
- Após autenticação, se preferências iniciais estiverem pendentes, encaminhar para Preferências.
- Login social só deve aparecer se suportado pela implementação.
- Mensagens de erro devem ser simples e específicas.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não.
- Fluxo neutro: não.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe campos de usuário/e-mail e senha.
- Permite autenticar e tratar erro.
- Permite navegar para Cadastro.
- Permite recuperação de acesso quando implementada.
- Redireciona User autenticado conforme estado de onboarding.
- Trata `loading`, `empty`, `success` e `error`.

## 12. Cadastro

### Identificação

- Nome: Cadastro
- Rota: `/cadastro`
- Objetivo: criar conta de User com dados pessoais mínimos e encaminhar para Preferências ou Home.

### Entidades utilizadas

- User

### Dados necessários

- `novoUsuario`
- `dadosPessoais`
- `dadosContato`
- `dadosEndereco`
- `erroCadastro`

### Componentes utilizados

- `AppScreen`
- `PageTitle`
- `TextField`
- `Button`

### Estados

- `loading`: criação de conta em andamento.
- `empty`: formulário inicial.
- `success`: conta criada e redirecionamento.
- `error`: validação ou falha de cadastro.

### Ações possíveis

- `preencherCadastro`
- `validarCadastro`
- `criarConta`
- `voltarLogin`

### Fluxos de entrada

- Login
- Onboarding

### Fluxos de saída

- Login
- Preferências
- Home

### Regras de negócio

- Cadastro deve criar User com dados obrigatórios definidos pelo produto.
- Campos sensíveis devem ter validação antes do envio.
- Após cadastro, preferências esportivas devem ser coletadas se ainda não existirem.
- Não usar vocabulário administrativo na tela.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não.
- Fluxo neutro: não.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe formulário de criação de conta.
- Valida campos obrigatórios.
- Cria User ou simula criação na camada de protótipo.
- Permite retornar ao Login.
- Encaminha para Preferências ou Home.
- Trata `loading`, `empty`, `success` e `error`.

## 13. Preferências

### Identificação

- Nome: Preferências
- Rota: `/preferencias` ou etapa de `/onboarding`
- Objetivo: coletar preferências esportivas iniciais ou permitir atualização de interesses do User.

### Entidades utilizadas

- User

### Dados necessários

- `usuarioAtual`
- `modalidadesDisponiveis`
- `preferenciasSelecionadas`
- `preferenciasUsuario`
- `conviteSocial`

### Componentes utilizados

- `AppScreen`
- `Logo`
- `PreferencesSelector`
- `Button`
- `Badge`

### Estados

- `loading`: carregar modalidades e preferências atuais.
- `empty`: nenhuma preferência selecionada.
- `success`: preferências prontas para salvar ou salvas.
- `error`: falha ao carregar ou salvar preferências.

### Ações possíveis

- `selecionarModalidade`
- `removerModalidade`
- `salvarPreferencias`
- `pularPreferencias`
- `convidarViaWhatsApp`

### Fluxos de entrada

- Onboarding
- Cadastro
- Conta
- Login quando preferências estiverem pendentes

### Fluxos de saída

- Home
- Conta
- Login

### Regras de negócio

- Preferências devem alimentar recomendações da Home.
- Pular deve ser permitido quando o produto aceitar experiência sem personalização inicial.
- Preferências podem sugerir modalidade no fluxo neutro de Criar Ativo, mas não devem bloquear criação.
- Convite social é secundário e não deve impedir conclusão.

### Contexto de criação de Ativo

- Pode iniciar Criar Ativo: não.
- Fluxo neutro: não.
- Fluxo com local: não.
- Fluxo com data: não.

### Critério de implementação

- Exibe modalidades com ícones ou emojis.
- Permite selecionar e remover preferências.
- Salva preferências no User.
- Atualiza recomendações usadas pela Home.
- Permite finalizar ou pular conforme regra de produto.
- Trata `loading`, `empty`, `success` e `error`.

