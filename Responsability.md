# Responsability

Documento de responsabilidade dos arquivos do repositorio `ilha-ativa` e do fluxo padrao de requests/interacoes do app.

## Visao geral

Este projeto e um prototipo React/Vite chamado Ilha Ativa. A aplicacao gerencia quadras publicas, agendamentos, solicitacoes de reparo e lobbies simples para eventos de trilha/yoga.

O app roda em modo UI-only: `src/api/base44Client.js` simula a camada Base44/local DB. As consultas retornam listas vazias e as mutacoes retornam objetos temporarios, mantendo a interface funcional sem backend real.

## Fluxo padrao de request/interacao

1. O navegador carrega `index.html`.
2. `index.html` monta o elemento `#root` e importa `/src/main.jsx`.
3. `src/main.jsx` renderiza `<App />` e importa os estilos globais de `src/index.css`.
4. `src/App.jsx` envolve a aplicacao com:
   - `AuthProvider`, de `src/lib/AuthContext.jsx`;
   - `QueryClientProvider`, usando `src/lib/query-client.js`;
   - `BrowserRouter`, do React Router;
   - `Toaster`, para notificacoes.
5. `AuthenticatedApp`, dentro de `src/App.jsx`, consulta `useAuth()`:
   - se estiver carregando auth/settings, mostra spinner;
   - se houver erro de usuario nao registrado, mostra `UserNotRegisteredError`;
   - se auth for exigida, chama `navigateToLogin`;
   - caso contrario, libera as rotas.
6. As rotas renderizam `src/components/layout/AppLayout.jsx`, que exibe `Sidebar` e um `<Outlet />`.
7. Cada pagina em `src/pages` usa React Query (`useQuery`, `useMutation`) para chamar `db.entities.*` ou `db.integrations.*`.
8. `src/api/base44Client.js` recebe essas chamadas e hoje devolve dados mockados:
   - `list/filter/get` retornam vazio/null;
   - `create/update/delete` retornam objetos locais temporarios;
   - `UploadFile` cria uma URL local via `URL.createObjectURL`.
9. Apos mutacoes, as paginas invalidam queries com `queryClient.invalidateQueries`, atualizando telas que dependem de `bookings`, `repairs`, `courts` ou `lobby`.

## Fluxos principais

### Dashboard

`/` carrega `Dashboard.jsx`, busca `Court`, `Booking` e `RepairRequest`, calcula indicadores, lista agendamentos/reparos recentes e aponta para os fluxos de agendamento e reparo.

### Quadras

`/quadras` carrega `Courts.jsx`, busca `Court`, filtra por texto/tipo e alterna entre lista e mapa. A lista usa `CourtCard`; o mapa usa `CourtsMap`, que mostra pins de quadras, trilhas e yoga.

### Agendamento

`/agendar` carrega `NewBooking.jsx`. A pagina:

- le `?court=` para preselecionar uma quadra;
- busca quadras disponiveis;
- busca agendamentos existentes por `court_id` e `date`;
- bloqueia horarios ja ocupados;
- cria `Booking` com status `pendente`;
- invalida a query `bookings`;
- mostra tela de sucesso.

### Solicitacao de reparo

`/reparos/novo` carrega `NewRepairRequest.jsx`. A pagina:

- le `?court=` para preselecionar uma quadra;
- busca quadras;
- permite anexar imagem;
- se houver imagem, chama `db.integrations.Core.UploadFile`;
- cria `RepairRequest` com status `aberto`;
- invalida a query `repairs`;
- mostra tela de sucesso.

### Minhas solicitacoes

`/minhas-solicitacoes` carrega `MyRequests.jsx`. A pagina:

- busca `Booking` e `RepairRequest`;
- separa os dados em abas;
- permite cancelar agendamento via `Booking.update(id, { status: 'cancelado' })`;
- invalida a query `bookings` apos cancelamento.

### Lobby de eventos

No mapa, trilhas e yoga abrem `EventLobbyPanel.jsx`. O painel:

- busca participantes em `EventLobby.filter({ event_id })`;
- refaz a busca a cada 5 segundos;
- permite entrar no lobby via `EventLobby.create`;
- permite sair/remover participante via `EventLobby.delete`.

## Responsabilidade por arquivo

### Raiz

| Arquivo | Responsabilidade |
| --- | --- |
| `.gitignore` | Define arquivos/pastas ignorados pelo Git: envs, logs, `node_modules`, `dist`, caches e pastas temporarias do Drive. |
| `components.json` | Configuracao do shadcn/ui: estilo, aliases, caminho do Tailwind/CSS e biblioteca de icones. |
| `eslint.config.js` | Configura ESLint para arquivos de paginas/componentes, regras React/hooks e remocao de imports nao usados. |
| `File-Three.md` | Snapshot/documentacao anterior da arvore de arquivos e notas sobre mudancas para rodar localmente. |
| `index.html` | HTML de entrada do Vite, define `#root`, metadata, CSS externo do Leaflet e importa `src/main.jsx`. Tambem contem uma linha JS antes do `<!doctype html>`, que parece sobra de adaptacao local. |
| `jsconfig.json` | Configura paths `@/*`, JSX, module resolution e escopo de typecheck/check JS. |
| `package.json` | Declara scripts, dependencias de runtime e dev dependencies do projeto. |
| `package-lock.json` | Lockfile npm com versoes resolvidas das dependencias. |
| `postcss.config.js` | Configura PostCSS com Tailwind CSS e Autoprefixer. |
| `README.md` | Explica como rodar/buildar o projeto e documenta o modo UI-only. |
| `tailwind.config.js` | Define tema Tailwind, tokens por CSS variables, fontes, radius, cores e plugin `tailwindcss-animate`. |
| `vite.config.js` | Configura Vite com React e alias `@` apontando para `src`. |
| `Responsability.md` | Este documento: responsabilidades dos arquivos e fluxo padrao de requests/interacoes. |

### Pastas geradas ou externas

| Caminho | Responsabilidade |
| --- | --- |
| `.git/` | Metadados do repositorio Git. |
| `.tmp.drivedownload/` | Pasta temporaria de download/sincronizacao, ignorada pelo Git. |
| `.tmp.driveupload/` | Pasta temporaria de upload/sincronizacao, ignorada pelo Git. |
| `dist/` | Build gerado do Vite, nao e codigo-fonte principal. |
| `node_modules/` | Dependencias instaladas pelo npm, nao deve ser editada manualmente. |

### Entidades

| Arquivo | Responsabilidade |
| --- | --- |
| `entities/Court` | Schema Base44 da entidade de quadra: nome, localizacao, tipo, status, imagem e descricao. |
| `entities/Booking` | Schema Base44 de agendamento: quadra, data, horario, duracao, finalidade, status e dados do solicitante. |
| `entities/RepairRequest` | Schema Base44 de solicitacao de reparo: quadra, titulo, descricao, prioridade, status, imagem e solicitante. |
| `entities/EventLobby` | Schema Base44 de participacao em evento: evento, tipo, participante, emoji e mensagem. |

### Entrada, providers e rotas

| Arquivo | Responsabilidade |
| --- | --- |
| `src/main.jsx` | Ponto de entrada React; monta `App` em `#root` e importa CSS global. |
| `src/App.jsx` | Compoe providers globais, autentica fluxo inicial e declara rotas principais. |
| `src/index.css` | Importa fontes, Tailwind layers e define tokens globais de tema claro/escuro. |

### API e estado global

| Arquivo | Responsabilidade |
| --- | --- |
| `src/api/base44Client.js` | Mock local da API/Base44: auth fake, entidades genericas e upload local de arquivo. |
| `src/lib/AuthContext.jsx` | Contexto de autenticacao local sempre autenticado, com usuario admin fake e funcoes de auth simuladas. |
| `src/lib/query-client.js` | Instancia unica do React Query, com retry 1 e sem refetch ao focar janela. |
| `src/lib/app-params.js` | Le parametros de URL/localStorage ligados a app/token/Base44 e normaliza defaults locais. |
| `src/lib/utils.js` | Helper `cn` para combinar classes com `clsx` e `tailwind-merge`; exporta `isIframe`. |
| `src/utils/index.ts` | Helper `createPageUrl`, converte nome de pagina em path simples. |

### Layout, protecao e erros

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/layout/AppLayout.jsx` | Layout base autenticado: sidebar fixa e area principal com `<Outlet />`. |
| `src/components/layout/Sidebar.jsx` | Navegacao lateral/mobile, logo, links de rotas e estado de menu mobile. |
| `src/components/ProtectedRoute.jsx` | Componente generico de rota protegida com fallback/loading e tratamento de auth. Hoje nao e usado por `App.jsx`. |
| `src/components/UserNotRegisteredError.jsx` | Tela de acesso restrito para usuario nao registrado. |
| `src/lib/PageNotFound.jsx` | Tela 404 para rotas nao mapeadas, com botao para voltar para `/`. |

### Paginas de dominio

| Arquivo | Responsabilidade |
| --- | --- |
| `src/pages/Dashboard.jsx` | Painel inicial com estatisticas, acoes rapidas, agendamentos recentes e reparos recentes. |
| `src/pages/Courts.jsx` | Tela de busca/filtro de quadras e alternancia entre visualizacao em mapa/lista. |
| `src/pages/NewBooking.jsx` | Formulario de novo agendamento, validacao basica, verificacao de horarios ocupados e criacao de `Booking`. |
| `src/pages/NewRepairRequest.jsx` | Formulario de nova solicitacao de reparo, upload opcional de foto e criacao de `RepairRequest`. |
| `src/pages/MyRequests.jsx` | Listagem de agendamentos/reparos em abas e cancelamento de agendamentos. |

### Componentes de dominio

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/courts/CourtsMap.jsx` | Mapa Leaflet de Ilhabela com pins de quadras, trilhas e yoga; controla filtros, modo edicao de pins e paineis laterais. |
| `src/components/courts/CourtSidePanel.jsx` | Painel lateral de detalhes da quadra, com status, dados, link Google Maps e acoes de agendar/reparo. |
| `src/components/courts/EventLobbyPanel.jsx` | Painel lateral de evento/trilha/yoga com participantes, confirmacao de presenca e remocao. |
| `src/components/shared/CourtCard.jsx` | Card reutilizavel de quadra para visualizacao em lista, com status e botoes de acao. |
| `src/components/shared/StatCard.jsx` | Card reutilizavel de metrica para o dashboard. |
| `src/components/shared/StatusBadge.jsx` | Badges padronizados para status de booking, status de reparo e prioridade. |

### Hooks

| Arquivo | Responsabilidade |
| --- | --- |
| `src/hooks/use-mobile.jsx` | Hook que observa `matchMedia` e retorna se a viewport esta abaixo de 768px. |

### Assets

| Arquivo | Responsabilidade |
| --- | --- |
| `src/assets/ec9c6d370_ChatGPTImage15deabrde202620_37_01.png` | Imagem/logo gerada usada como asset local disponivel no projeto. |
| `src/assets/logo.webp` | Logo em formato WebP disponivel como asset local. |

### Componentes UI

Estes arquivos sao wrappers/componentes de design system, majoritariamente no padrao shadcn/ui, usando Radix UI, lucide-react e helpers de classe.

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/ui/accordion.jsx` | Accordion expansivel baseado em Radix Accordion. |
| `src/components/ui/alert-dialog.jsx` | Dialog de confirmacao/alerta modal baseado em Radix Alert Dialog. |
| `src/components/ui/alert.jsx` | Bloco visual de alerta com titulo/descricao e variantes. |
| `src/components/ui/aspect-ratio.jsx` | Wrapper Radix para manter proporcao fixa de conteudo. |
| `src/components/ui/avatar.jsx` | Avatar, imagem e fallback baseados em Radix Avatar. |
| `src/components/ui/badge.jsx` | Badge/etiqueta visual com variantes. |
| `src/components/ui/breadcrumb.jsx` | Componentes de breadcrumb, separador e ellipsis. |
| `src/components/ui/button.jsx` | Botao padronizado com variantes, tamanhos e suporte a `asChild`. |
| `src/components/ui/calendar.jsx` | Calendario baseado em `react-day-picker` com estilos do design system. |
| `src/components/ui/card.jsx` | Card e subcomponentes: header, title, description, content e footer. |
| `src/components/ui/carousel.jsx` | Carousel baseado em Embla, com contexto e botoes anterior/proximo. |
| `src/components/ui/chart.jsx` | Wrappers para Recharts, tooltip, legenda e injecao de estilos por tema. |
| `src/components/ui/checkbox.jsx` | Checkbox baseado em Radix Checkbox. |
| `src/components/ui/collapsible.jsx` | Collapsible simples baseado em Radix Collapsible. |
| `src/components/ui/command.jsx` | Command palette/lista pesquisavel baseada em `cmdk`, incluindo dialog. |
| `src/components/ui/context-menu.jsx` | Menu de contexto baseado em Radix Context Menu. |
| `src/components/ui/dialog.jsx` | Dialog modal generico baseado em Radix Dialog. |
| `src/components/ui/drawer.jsx` | Drawer/painel deslizante baseado em `vaul`. |
| `src/components/ui/dropdown-menu.jsx` | Dropdown menu baseado em Radix Dropdown Menu. |
| `src/components/ui/form.jsx` | Helpers de formulario integrados ao `react-hook-form`. |
| `src/components/ui/hover-card.jsx` | Card que aparece em hover baseado em Radix Hover Card. |
| `src/components/ui/input-otp.jsx` | Campo de codigo OTP baseado em `input-otp`. |
| `src/components/ui/input.jsx` | Input HTML estilizado. |
| `src/components/ui/label.jsx` | Label baseado em Radix Label. |
| `src/components/ui/menubar.jsx` | Barra de menus baseada em Radix Menubar. |
| `src/components/ui/navigation-menu.jsx` | Menu de navegacao baseado em Radix Navigation Menu. |
| `src/components/ui/pagination.jsx` | Componentes de paginacao e links anterior/proximo. |
| `src/components/ui/popover.jsx` | Popover baseado em Radix Popover. |
| `src/components/ui/progress.jsx` | Barra de progresso baseada em Radix Progress. |
| `src/components/ui/radio-group.jsx` | Radio group baseado em Radix Radio Group. |
| `src/components/ui/resizable.jsx` | Paineis redimensionaveis baseados em `react-resizable-panels`. |
| `src/components/ui/scroll-area.jsx` | Area com scroll customizado baseada em Radix Scroll Area. |
| `src/components/ui/select.jsx` | Select/dropdown de selecao baseado em Radix Select. |
| `src/components/ui/separator.jsx` | Separador horizontal/vertical baseado em Radix Separator. |
| `src/components/ui/sheet.jsx` | Sheet lateral baseado em Radix Dialog com variantes de lado. |
| `src/components/ui/sidebar.jsx` | Sistema completo de sidebar shadcn: provider, trigger, groups, menus, rail e estados responsivos. |
| `src/components/ui/skeleton.jsx` | Placeholder visual de carregamento. |
| `src/components/ui/slider.jsx` | Slider baseado em Radix Slider. |
| `src/components/ui/sonner.jsx` | Toaster baseado na biblioteca `sonner`. |
| `src/components/ui/switch.jsx` | Switch/toggle binario baseado em Radix Switch. |
| `src/components/ui/table.jsx` | Tabela e subcomponentes semanticos estilizados. |
| `src/components/ui/tabs.jsx` | Tabs baseadas em Radix Tabs. |
| `src/components/ui/textarea.jsx` | Textarea HTML estilizado. |
| `src/components/ui/toast.jsx` | Primitivos de toast: provider, viewport, item, action, close, title e description. |
| `src/components/ui/toaster.jsx` | Renderizador dos toasts ativos usando `useToast`. |
| `src/components/ui/toggle-group.jsx` | Grupo de toggles baseado em Radix Toggle Group. |
| `src/components/ui/toggle.jsx` | Toggle individual baseado em Radix Toggle. |
| `src/components/ui/tooltip.jsx` | Tooltip baseado em Radix Tooltip. |
| `src/components/ui/use-toast.jsx` | Store/hook local para criar, atualizar e remover toasts. |

## Observacoes tecnicas

- A camada de dados real ainda nao existe; o ponto mais limpo para conectar backend e substituir `src/api/base44Client.js` mantendo os metodos `list`, `filter`, `get`, `create`, `update` e `delete`.
- As entidades em `entities/` documentam o shape esperado dos dados, mas nao sao importadas diretamente pelo codigo React atual.
- O projeto tem varios componentes UI disponiveis que ainda nao sao usados pelas telas atuais; isso e normal em bases shadcn/ui.
- Ha textos com encoding quebrado em varios arquivos (`SolicitaÃ§Ãµes`, `PÃºblicas`, etc.). Funcionalmente o app compila, mas a apresentacao em portugues pode precisar de normalizacao para UTF-8.
- `index.html` contem uma linha JavaScript antes do doctype. Isso merece revisao se aparecer comportamento estranho no carregamento.
