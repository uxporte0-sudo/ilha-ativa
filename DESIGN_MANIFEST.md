# IlhAtiva - Design Manifest

Este documento é a fonte oficial de verdade para a implementação visual do IlhAtiva.

Ele deriva de `generated/figma.json` e `generated/Figma_Variables.json`. O domínio, entidades e rotas funcionais são definidos em `ARCHITECTURE_MANIFEST.md`; este documento define a experiência visual, o design system, os componentes, os layouts e os padrões de interação.

O Figma é a fonte oficial de UX/UI. Quando houver divergência visual entre este documento e o código legado, este documento prevalece.

## 1. Filosofia Visual

O IlhAtiva quer ser percebido como **esportivo, acolhedor, comunitário, acessível e energético**.

A interface não deve parecer administrativa, institucional ou pesada. Ela deve se comportar como um aplicativo comunitário de ação rápida: encontrar uma prática, participar, criar, reportar e acompanhar. A linguagem visual deve incentivar movimento sem sacrificar clareza.

### Personalidade Da Marca

- **Esportiva:** usa ícones, emojis/modalidades, cards compactos e CTAs de ação.
- **Acolhedora:** superfícies claras, tons quentes, cantos arredondados e mensagens diretas.
- **Comunitária:** enfatiza pessoas, participação, quorum, locais e colaboração.
- **Acessível:** layout mobile-first, botões grandes, navegação previsível e linguagem simples.
- **Energética:** laranja vibrante para ação, teal para foco e estados ativos, amarelo para conquista.

### Linguagem Gráfica

A linguagem gráfica combina:

- app mobile de 412px de largura;
- superfícies claras e quentes;
- cards com sombra curta;
- botões arredondados;
- navegação com ícones circulares;
- emojis esportivos como sinais rápidos de modalidade;
- progressão visual em fluxos;
- mapas, calendários e listas como modos complementares de descoberta.

### Sensações Transmitidas

A experiência deve transmitir:

- “é fácil começar”;
- “tem gente perto de mim fazendo algo”;
- “eu posso criar uma oportunidade agora”;
- “meu bairro e meus locais importam”;
- “minha prática esportiva gera memória e progresso”.

## 2. Identidade Visual

### Paleta Principal

A paleta é construída sobre três forças:

- **Laranja:** ação principal, criação, avanço e confirmação.
- **Teal:** foco, seleção, estado ativo e energia esportiva.
- **Amarelo:** conquista, retrospectiva, destaque positivo e celebração.

As superfícies usam tons claros, levemente quentes, evitando branco puro como única base visual. O branco existe como container secundário, mas a experiência geral deve parecer mais humana e solar do que clínica.

### Funções Semânticas Das Cores

- `brand/primary` (`#FF8800`): CTA principal, Criar Ativo, continuar, enviar, salvar quando for ação primária.
- `brand/primary-strong` (`#CC6D00`): hover/pressed em modo claro, reforço visual e estados de ação.
- `brand/primary-subtle` (`#FFE7CC`): fundo suave para destaques laranja.
- `brand/secondary` (`#19E6CE`): foco, seleção, navegação ativa e elementos de estado.
- `brand/accent` (`#FFB300`): conquistas, retrospectiva, progresso positivo e destaque motivacional.
- `surface/base` (`#FEFEFE`) e `surface/base2` (`#F5F5F0`): tela e fundo geral.
- `container/primary` (`#F9F3E9`): blocos principais e áreas de conteúdo.
- `container/secondary` (`#FFFFFF`): campos, cards claros e elementos internos.
- `text/primary` (`#0C2127`): títulos e conteúdo principal.
- `text/secondary` (`#256374`): subtítulos e metadados.
- `text/tertiary` (`#3DA5C2`): legendas, links leves e informações auxiliares.

### Tipografia

O Figma usa principalmente **Inter**, **Roboto** e **Rubik**.

Diretriz oficial para implementação:

- **Inter:** fonte principal da interface, formulários, navegação, componentes e textos funcionais.
- **Rubik:** fonte expressiva para telas de maior personalidade, números de retrospectiva, cards esportivos e títulos de campanha quando necessário.
- **Roboto:** pode aparecer em componentes Material-like, campos e calendário, mas deve ser normalizado para Inter quando a implementação precisar consistência.

Hierarquia recomendada:

- Tela/título forte: 32-40px, peso 700.
- Título de página: 20-24px, peso 700.
- Título de seção: 16-20px, peso 600 ou 700.
- Corpo: 14-16px, peso 400.
- Metadados de card: 10-12px, peso 500 ou 600.
- Rótulos de botões: 12-14px, peso 600 ou 700, caixa alta apenas quando o Figma usa esse tom de comando.

Letter spacing deve ser 0 na maioria dos textos. Padrões herdados de Roboto com letter spacing pequeno podem ser usados apenas em campos e elementos Material-like.

### Ícones

O sistema visual usa uma mistura de:

- ícones lineares;
- ícones circulares preenchidos;
- emojis de modalidade;
- marcadores de mapa;
- ícones de status/progresso.

Diretriz:

- Ícones de navegação devem ser simples, reconhecíveis e centralizados em botões circulares.
- Ícones esportivos podem usar emojis quando representarem modalidade e precisarem ser lidos rapidamente.
- Ícones funcionais devem ser lineares, com espessura visual média, equivalentes a 24px ou 44px conforme contexto.
- O botão central de Criar Ativo deve ser maior que os demais e pode usar ícone mais expressivo.

### Ilustrações E Imagens

O Figma usa imagens/retângulos de mapa, cards e elementos de marca como suporte visual. Ilustrações não são decoração solta; elas devem ajudar a reconhecer:

- modalidade;
- local;
- mapa;
- retrospectiva;
- status de progresso;
- marca/logo.

Evitar fundos genéricos e ilustrações sem função. Quando houver imagem, ela deve representar local, modalidade, mapa, perfil ou conquista.

### Espaçamento

O ritmo visual observado é compacto e mobile-first.

Padrões:

- gaps frequentes: 4, 6, 8, 10 e 16px;
- padding interno de cards: 16px;
- padding de botões compactos: 10px;
- padding de ícones circulares pequenos: 8px;
- campos com conteúdo interno de 16px à esquerda;
- largura útil comum entre 337px e 382px dentro de tela 412px;
- cards horizontais de lista próximos a 349px de largura.

## 3. Design Tokens

Os tokens oficiais vêm de `generated/Figma_Variables.json`.

### Cores Base - Light

| Token | Valor | Função |
| --- | --- | --- |
| `primary/500` | `#FF8800` | Laranja principal da marca |
| `secondary/500` | `#19E6CE` | Teal de foco/seleção |
| `accent/500` | `#FFB300` | Amarelo de conquista |
| `text/900` | `#0C2127` | Texto mais forte no modo claro |
| `text/700` | `#256374` | Texto secundário |
| `text/500` | `#3DA5C2` | Texto terciário/link leve |
| `background/50` | `#F5F5F0` | Fundo claro quente |
| `background/200` | `#D6D6C2` | Superfícies/bordas sutis |
| `container/primary` | `#F9F3E9` | Container principal |
| `container/primary-strong` | `#FAEEDD` | Container principal reforçado |
| `container/secondary` | `#FFFFFF` | Cards/campos brancos |
| `container/secondary-strong` | `#CBECE6` | Container secundário com teal suave |
| `container/accent` | `#FAF5E7` | Container de destaque leve |
| `container/accent-strong` | `#FAF1D9` | Container de conquista leve |

### Cores Semânticas - Light

| Token | Valor | Função |
| --- | --- | --- |
| `text/primary` | `#0C2127` | Títulos, texto principal |
| `text/secondary` | `#256374` | Subtítulos e metadados |
| `text/tertiary` | `#3DA5C2` | Legendas e links suaves |
| `text/disabled` | `#8BC9DA` | Texto desabilitado |
| `text/inverse` | `#ECF6F9` | Texto sobre fundos escuros/laranja |
| `surface/base` | `#FEFEFE` | Superfície de tela |
| `surface/base2` | `#F5F5F0` | Fundo alternativo quente |
| `surface/subtle` | `#EBEBE0` | Faixas e áreas discretas |
| `surface/card` | `#D6D6C2` | Superfície de card quando não usar container |
| `surface/elevated` | `#C2C2A3` | Modais/superfícies elevadas |
| `surface/inverse` | `#1F1F14` | Navbar escura ou contraste inverso |
| `brand/primary` | `#FF8800` | CTA principal |
| `brand/primary-strong` | `#CC6D00` | Hover/press claro |
| `brand/primary-subtle` | `#FFE7CC` | Fundo laranja suave |
| `brand/secondary` | `#19E6CE` | Foco/seleção |
| `brand/accent` | `#FFB300` | Conquista |
| `interaction/default` | `#FF8800` | Estado interativo padrão |
| `interaction/hover` | `#CC6D00` | Hover |
| `interaction/pressed` | `#995200` | Pressed |
| `interaction/focus` | `#19E6CE` | Foco acessível |
| `interaction/disabled` | `#ADAD85` | Desabilitado |
| `border/subtle` | `#D6D6C2` | Separadores leves |
| `border/default` | `#C2C2A3` | Borda padrão |
| `border/strong` | `#999966` | Borda forte |
| `border/focus` | `#19E6CE` | Borda em foco |

### Cores Semânticas - Dark

O Figma define modo escuro, mas a experiência desenhada prioriza modo claro. Dark mode deve ser suportado por tokens, não por cores hardcoded.

Tokens principais:

- `surface/base`: `#071012`
- `surface/card`: `#1C424A`
- `text/primary`: `#EBEBE0`
- `brand/primary`: `#FF8800`
- `brand/secondary`: `#19E6CE`
- `brand/accent`: `#FFB300`

### Error E Success

O arquivo de variáveis não define tokens explícitos `error` e `success`. A implementação deve criar aliases semânticos a partir da linguagem existente:

- `success`: usar `brand/secondary` (`#19E6CE`) ou um alias derivado para confirmações positivas e estados completos.
- `error`: criar token semântico próprio antes da implementação visual; não reutilizar laranja, pois laranja é ação principal.

### Tipografia

Não há coleção formal de variáveis tipográficas no arquivo de variáveis. A especificação deve usar os estilos recorrentes do Figma:

- Inter 10/12, 12/14, 14/17, 16/22, 18/22, 20/24, 32/39.
- Rubik 12/14, 14/17, 20/24, 32/38, 40/47 para títulos expressivos e retrospectiva.
- Pesos principais: 400, 500, 600, 700.

### Espaçamento

Não há coleção formal de variáveis de espaçamento, mas os padrões recorrentes são:

- `space-1`: 4px
- `space-2`: 8px
- `space-2.5`: 10px
- `space-3`: 12px
- `space-4`: 16px
- `space-6`: 24px
- `space-8`: 32px

### Radius

Raios observados:

- 4px: componentes pequenos, indicadores, micro-containers.
- 8px: cards compactos e elementos internos.
- 10-12px: campos e cards padrão.
- 20px: botões retangulares arredondados.
- 50-100px ou `9999px`: botões circulares, avatars, toggles.

Regra: botões e navegação podem ser muito arredondados; cards de conteúdo devem manter raio moderado para preservar leitura.

### Elevação

Padrões observados:

- Botões primários: sombra dupla com `0 4 4 rgba(0,0,0,.30)` e `0 8 12 6 rgba(0,0,0,.15)`.
- Cards: sombra curta com `0 2 6 2 rgba(0,0,0,.15)` e `0 1 2 rgba(0,0,0,.30)`.
- Menu inferior: sombra para cima `0 -10 14 rgba(0,0,0,.45)`.
- Menu superior: sombra para baixo `0 10 14 rgba(0,0,0,.45)`.
- Menu reto: sombra ampla `0 16 32 -8 rgba(12,12,13,.40)`.

Elevação deve indicar interatividade ou separação estrutural. Não usar sombras decorativas aleatórias.

## 4. Componentes

### Botão

Objetivo: executar ações principais e secundárias.

Variantes:

- `Cor=Laranja, Hierarquia=Primário`
- `Cor=Laranja, Hierarquia=Secundário`
- `Cor=Azul, Hierarquia=Primário`
- `Cor=Azul, Hierarquia=Secundário`
- `Cor=Laranja+icon, Hierarquia=Primário`

Estados:

- default;
- hover;
- pressed;
- disabled;
- focused.

Comportamentos:

- primário usa preenchimento forte e sombra;
- secundário deve reduzir peso visual;
- versão com ícone é maior, indicada para CTAs longos e fluxos;
- altura base compacta: 44px;
- CTA largo: 64px de altura quando usado em fluxo.

Tokens:

- `brand/primary`;
- `brand/secondary`;
- `text/inverse`;
- `interaction/hover`;
- `interaction/focus`;
- `interaction/disabled`.

### Campo / Text Field

Objetivo: entrada de dados em login, cadastro, conta, zeladoria e criação de Ativo.

Variantes:

- `Style=Filled`
- `Style=Outlined`
- `Tamanho=Curto` próximo a 56px de altura;
- `Tamanho=Longo` próximo a 107px total, com área de texto de 91px;
- configurações de texto: input, label, placeholder.

Estados:

- enable;
- focused;
- disabled;
- hovered;
- error.

Comportamentos:

- campo deve mostrar label ou placeholder de forma clara;
- texto de suporte fica abaixo;
- foco usa `border/focus` ou indicador ativo teal;
- erro deve ter token próprio e texto de suporte contextual.

Tokens:

- `container/secondary`;
- `border/default`;
- `border/focus`;
- `text/primary`;
- `text/secondary`;
- `text/disabled`.

### Card De Ativo

Objetivo: apresentar um Ativo em contexto de descoberta.

Variantes:

- `Ativo Home`: card vertical compacto, 131x217.
- `Horizontal card`: card horizontal, 349x80.

Estados:

- ativo/colorido;
- ativo/branco;
- desativo/branco;
- desativo/colorido.

Comportamentos:

- mostrar nome, local, quorum, nível de dificuldade, distância, hora e modalidade;
- cards verticais favorecem carrossel horizontal na Home;
- cards horizontais favorecem Agenda e listas densas;
- status ativo/desativo altera contraste, não estrutura.

Tokens:

- `container/primary`;
- `container/secondary`;
- `brand/primary`;
- `brand/secondary`;
- `text/primary`;
- `text/secondary`.

### Card De Local

Objetivo: representar um Local em listas, Home e Mapa.

Variantes:

- `Locais` 350x110, cor laranja ou azul, tom cor ou claro.
- `Card Local` 127x95, compacto para blocos de destaque.

Estados:

- cor laranja;
- cor azul;
- tom colorido;
- tom claro.

Comportamentos:

- exibir nome, logradouro, bairro, número, cidade e tipo;
- em Mapa, deve abrir ficha do Local;
- em ficha de Local, deve permitir Criar Ativo com local pré-preenchido.

Tokens:

- `container/primary`;
- `container/secondary-strong`;
- `brand/primary`;
- `brand/secondary`;
- `border/subtle`.

### Card De Zeladoria

Objetivo: organizar criação, revisão e acompanhamento de reportes.

Variantes:

- bloco de formulário;
- bloco de revisão;
- bloco de fotos;
- bloco de status futuro.

Estados:

- preenchendo;
- revisando;
- enviado;
- erro de validação.

Comportamentos:

- deve usar progressão visual;
- revisão precisa agrupar detalhes do problema, local e fotos;
- CTA final usa laranja e texto claro.

Tokens:

- `container/primary`;
- `container/secondary`;
- `brand/primary`;
- `text/primary`;
- `text/secondary`.

### Menu

Objetivo: navegação principal do app.

Variantes:

- `Posição=Bottom` 412x157.
- `Posição=Top` 412x148.
- `Posição=Reto` 413x113.

Itens:

- Mapa;
- Agenda;
- Configurações/Conta;
- Zeladoria Comunitária;
- Criar Ativo.

Comportamentos:

- Criar Ativo é o item central e maior;
- itens usam Circle Button;
- estado selecionado deve ser visível por cor/teal ou contraste;
- menu inferior é padrão para Home e descoberta;
- menu superior aparece em telas específicas conforme Figma;
- menu reto pode ser usado quando a tela exige menos altura.

Tokens:

- `surface/inverse` ou container escuro conforme variação;
- `brand/primary`;
- `brand/secondary`;
- `text/inverse`;
- elevação de menu.

### Circle Button

Objetivo: acionar navegação ou ação central de forma rápida.

Variantes:

- laranja 104x104 para ação principal;
- azul 78x87 para navegação;
- azul selecionado;
- ícone neutro.

Estados:

- não selecionado;
- selecionado;
- pressed;
- disabled quando necessário.

Comportamentos:

- deve preservar dimensão estável;
- ícone centralizado;
- área clicável mínima compatível com mobile;
- o botão maior não deve competir com conteúdo, mas deve comandar a navegação.

### Switch

Objetivo: alternar estados binários.

Variantes:

- ligado;
- desligado;
- `Switch PúblicoPrivado` com rótulos público/privado.

Comportamentos:

- em Criar Ativo, controla privacidade;
- em cards horizontais, pode representar ativação/participação;
- mudança deve ter feedback imediato.

Tokens:

- `brand/secondary`;
- `interaction/disabled`;
- `container/secondary`.

### PageTitle

Objetivo: padronizar cabeçalhos internos.

Estrutura:

- ação de voltar à esquerda;
- título;
- descrição/subtítulo;
- área de ação à direita quando necessário.

Comportamentos:

- deve manter largura útil aproximada de 382px;
- títulos são claros e orientados à tarefa;
- descrição explica contexto, não substitui CTA.

### ProgressIcon E ProgressBar

Objetivo: representar etapa em fluxos.

Variantes:

- fazendo;
- feito;
- a fazer.

Comportamentos:

- usado em Zeladoria e Criar Ativo;
- deve mostrar etapa atual sem exigir leitura longa;
- labels como “Detalhes” e “Conferir” aparecem abaixo/ao lado do indicador.

### Badge

Objetivo: representar metadados curtos.

Usos:

- modalidade;
- dificuldade;
- status;
- quorum;
- distância;
- hora.

Comportamentos:

- deve ser compacto;
- usar cor para reforçar categoria, não como única fonte de significado;
- deve caber em cards pequenos sem quebrar layout.

### Avatar

Objetivo: representar User ou contato comunitário.

Comportamentos:

- circular;
- pode usar foto, inicial ou ícone;
- em retrospectiva, pode aparecer associado a “Amigo mais ativo”.

### Calendário

Objetivo: descoberta temporal de Ativos.

Comportamentos:

- mês visível;
- dias em grid;
- dia selecionado destacado;
- dias com Ativos devem ter marcador;
- lista de próximos Ativos aparece abaixo.

Tokens:

- `container/primary`;
- `brand/primary`;
- `brand/secondary`;
- `text/primary`.

### Navegação Contextual

Objetivo: permitir voltar, avançar, editar, revisar e compartilhar.

Comportamentos:

- voltar deve ser discreto;
- continuar/enviar/salvar deve ser laranja quando primário;
- compartilhar retrospectiva usa CTA largo;
- “ver todos >” usa texto/link, não botão pesado.

## 5. Estrutura Das Telas

### Preferências

Objetivo: configurar preferências esportivas no onboarding.

Componentes:

- Screen;
- Logo/visual de marca;
- seleção de modalidades com ícones/emojis;
- botão WhatsApp;
- botões Finalizar e Pular.

Hierarquia visual:

1. Boas-vindas.
2. Pedido de preferência.
3. Grade/linha de modalidades.
4. Convite por WhatsApp.
5. Finalizar/Pular.

CTA principal: Finalizar.

CTA secundário: Pular, WhatsApp.

Fluxos de entrada: Onboarding inicial.

Fluxos de saída: Home ou Login, conforme autenticação.

### Login

Objetivo: autenticar User.

Componentes:

- Screen Login;
- campos Usuário e Senha;
- link “Esqueci minha senha”;
- botões Login e Cadastrar;
- botões sociais Google/Facebook.

Hierarquia visual:

1. Campos de acesso.
2. Recuperação.
3. Login.
4. Cadastro/social.

CTA principal: Login.

CTA secundário: Cadastrar, Entrar com Google, Entrar com Facebook.

Fluxos de entrada: Onboarding, sessão expirada.

Fluxos de saída: Home, Cadastro, recuperação.

### Cadastro

Objetivo: criar conta com dados pessoais.

Componentes:

- Page/Screen;
- link `< Login`;
- TextFields;
- botão Cadastrar.

Hierarquia visual:

1. Retorno ao Login.
2. Dados principais: Nome, Senha.
3. Dados pessoais: nascimento, gênero, telefone, CPF.
4. Endereço: CEP, bairro, logradouro, número.
5. Cadastrar.

CTA principal: Cadastrar.

CTA secundário: Login.

Fluxos de entrada: Login.

Fluxos de saída: Preferências ou Home.

### Home

Objetivo: descoberta por relevância.

Componentes:

- Screen;
- Header;
- Ativo Home cards;
- Card Local;
- Menu bottom;
- seções “Próximos de você”, “Baseado em seus gostos”, “Locais em alta”;
- CTA “Que tal criar um ativo?”.

Hierarquia visual:

1. Conteúdo recomendado.
2. Ativos próximos.
3. Ativos por preferência.
4. CTA de criação.
5. Locais em alta.
6. Navegação principal.

CTA principal: Criar Ativo.

CTA secundário: ver todos.

Fluxos de entrada: Login, Onboarding, navegação principal.

Fluxos de saída: Detalhes do Ativo, Mapa, Agenda, Criar Ativo, Local.

### Tela Mapa

Objetivo: descoberta por localização.

Componentes:

- mapa full-screen;
- search field “Buscar quadras, trilhas, eventos...”;
- marcadores;
- menu.

Hierarquia visual:

1. Busca no topo.
2. Mapa.
3. Marcadores e interação.
4. Menu.

CTA principal: selecionar Local/Ativo ou Criar Ativo contextual.

CTA secundário: alternar lista.

Fluxos de entrada: Home, menu.

Fluxos de saída: ficha de Local, lista, Detalhes do Ativo.

### Tela Mapa / Visualização Lista

Objetivo: descoberta espacial em formato de lista.

Componentes:

- search field;
- Locais cards 350x110;
- overlay/lista sobre mapa;
- menu.

Hierarquia visual:

1. Busca.
2. Lista de Locais.
3. Mapa em segundo plano/overlay.

CTA principal: abrir Local.

CTA secundário: voltar ao mapa.

Fluxos de entrada: Mapa.

Fluxos de saída: ficha de Local, Mapa.

### Ficha Do Local + Criar Ativo

Objetivo: aprofundar um Local e iniciar criação contextual.

Componentes:

- search field;
- mapa/overlay;
- botão de Zeladoria com ícone;
- botão “Criar Ativo +”;
- menu reto.

Hierarquia visual:

1. Local/mapa.
2. Ações contextuais.
3. Criar Ativo como ação dominante.

CTA principal: Criar Ativo +.

CTA secundário: Zeladoria.

Fluxos de entrada: Mapa/lista.

Fluxos de saída: Criar Ativo com `localId`, Zeladoria com `localId`.

### Agenda

Objetivo: descoberta por tempo.

Componentes:

- calendário mensal;
- marcadores `AtivoCalendar`;
- seção “Meus Ativos” ou “Próximos Ativos”;
- Horizontal cards;
- Menu.

Hierarquia visual:

1. Título “Minha agenda” ou “Agenda”.
2. Calendário.
3. Ativos do período/dia.
4. Navegação.

CTA principal: Criar Ativo com data.

CTA secundário: abrir Ativo.

Fluxos de entrada: Home, menu.

Fluxos de saída: Criar Ativo com `date`, Detalhes do Ativo, Retrospectiva.

### Criar Ativo

Objetivo: criar Ativo em fluxo guiado.

Componentes:

- PageTitle;
- ProgressIcon/ProgressBar;
- TextFields;
- Switch PúblicoPrivado;
- filtros de idade/gênero;
- CTA Criar Ativo.

Hierarquia visual:

1. Título e progresso.
2. Informações gerais.
3. Local, categoria, título.
4. Número mínimo, data e horários.
5. Descrição.
6. Filtros e privacidade.
7. Criar Ativo.

CTA principal: Criar Ativo.

CTA secundário: voltar etapa.

Fluxos de entrada: Home, Mapa, Agenda.

Fluxos de saída: revisão/publicação e Detalhes do Ativo.

### Zeladoria Comunitária

Objetivo: reportar problema em Local.

Componentes:

- PageTitle;
- ProgressIcon;
- ProgressBar;
- TextFields;
- PhotoUploader;
- botão Continuar.

Hierarquia visual:

1. Título e propósito comunitário.
2. Progresso.
3. Detalhes do problema.
4. Local.
5. Fotos.
6. Continuar.

CTA principal: Continuar.

CTA secundário: voltar.

Fluxos de entrada: menu, ficha de Local.

Fluxos de saída: Revisar Zeladoria.

### Revisar Zeladoria

Objetivo: confirmar dados antes do envio.

Componentes:

- PageTitle;
- ProgressIcon/ProgressBar;
- ReviewCards;
- botão ENVIAR REPORT;
- botão Voltar e editar informações.

Hierarquia visual:

1. Revise suas informações.
2. Detalhes do problema.
3. Local.
4. Fotos adicionadas.
5. Enviar.
6. Editar.

CTA principal: ENVIAR REPORT.

CTA secundário: Voltar e editar informações.

Fluxos de entrada: Zeladoria Comunitária.

Fluxos de saída: Zeladoria enviada, edição.

### Retrospectiva

Objetivo: transformar histórico em motivação.

Componentes:

- PageTitle;
- seletor de período;
- cards/linhas de modalidade;
- métricas de comunidade;
- CTA Compartilhar Retrospectiva.

Hierarquia visual:

1. Título e período.
2. Sua atividade.
3. Modalidades com percentuais.
4. Comunidade ativa.
5. Evolução.
6. Compartilhar.

CTA principal: Compartilhar Retrospectiva.

CTA secundário: Ver detalhes, Ver todos.

Fluxos de entrada: Conta, Agenda, menu.

Fluxos de saída: compartilhamento, detalhes.

### Minha Conta

Objetivo: editar dados pessoais.

Componentes:

- Screen;
- PageTitle visual “Minha conta”;
- TextFields;
- botão Salvar;
- Menu top.

Hierarquia visual:

1. Título.
2. Salvar.
3. Campos de dados.
4. Navegação.

CTA principal: Salvar.

CTA secundário: navegação para outras áreas.

Fluxos de entrada: menu/configurações.

Fluxos de saída: Home, Retrospectiva, preferências.

## 6. Navegação

### Menu Inferior

Uso padrão para telas de descoberta e Home.

Características:

- ocupa a largura da tela;
- tem sombra para separação;
- item central Criar Ativo é maior;
- itens laterais são circulares;
- adequado para alcance do polegar.

### Menu Superior

Uso em telas onde o conteúdo inferior precisa ficar livre ou quando o Figma demonstra header/nav fixa superior.

Características:

- ocupa topo;
- mantém ações principais acessíveis;
- separa conteúdo com sombra inferior.

### Menu Reto

Uso em telas de mapa/ficha com menos altura de navegação.

Características:

- altura menor;
- cria barra mais compacta;
- ainda preserva Criar Ativo como ação central.

### Botões Contextuais

- “Criar Ativo +” na ficha do Local é o CTA contextual mais importante.
- “Continuar” e “ENVIAR REPORT” comandam fluxo de Zeladoria.
- “Compartilhar Retrospectiva” é CTA largo de celebração.
- “Salvar” em Conta é ação primária, mas local.

### Ação Principal Da Aplicação

A ação principal é **Criar Ativo**.

Ela deve:

- ficar visualmente acima das demais ações;
- aparecer na navegação principal;
- aceitar contexto de Mapa e Agenda;
- usar laranja como cor de comando;
- ter área de toque maior que itens comuns.

## 7. Arquitetura De Descoberta

O Figma apresenta três modelos complementares de descoberta.

### Descoberta Por Relevância - Home

A Home responde: “o que faz sentido para mim agora?”

Critérios visuais:

- seções curtas;
- cards verticais de Ativo;
- recomendações baseadas em preferências;
- Locais em alta;
- links “ver todos >”.

Comportamento:

- prioriza escaneabilidade;
- permite salto rápido para Criar Ativo;
- mistura Ativos e Locais para alimentar decisão.

### Descoberta Por Tempo - Agenda

A Agenda responde: “quando vou praticar?”

Critérios visuais:

- calendário como estrutura dominante;
- marcadores de Ativo nos dias;
- lista de próximos Ativos;
- cards horizontais compactos.

Comportamento:

- selecionar dia filtra Ativos;
- criar a partir de dia pré-preenche data;
- Ativos confirmados devem ganhar maior destaque.

### Descoberta Por Localização - Mapa

O Mapa responde: “o que existe perto de mim ou neste lugar?”

Critérios visuais:

- mapa como superfície principal;
- busca persistente no topo;
- alternância entre mapa e lista;
- cards de Local;
- ficha contextual.

Comportamento:

- selecionar marcador abre contexto;
- lista serve para leitura rápida;
- criar a partir de Local pré-preenche local.

### Comparação

| Modelo | Pergunta | Componente dominante | CTA contextual |
| --- | --- | --- | --- |
| Home | O que é relevante? | Ativo Home / Card Local | Criar Ativo neutro |
| Agenda | Quando acontece? | Calendário / Horizontal card | Criar Ativo com data |
| Mapa | Onde acontece? | Mapa / Locais | Criar Ativo com Local |

## 8. Arquitetura De Criação De Ativos

### Pontos De Entrada

- Home: fluxo neutro.
- Agenda: fluxo iniciado por data.
- Mapa: fluxo iniciado por Local.
- Ficha do Local: fluxo iniciado por Local explícito.

### Fluxo Neutro

Entrada pela Home ou menu central.

Pré-preenchimentos:

- `privacidade`: público;
- `modalidade`: opcional, se houver preferência forte do usuário;
- `minimoParticipantes`: sugestão por modalidade, mas editável.

### Fluxo Iniciado Pelo Mapa

Entrada por marcador, lista ou ficha de Local.

Pré-preenchimentos:

- `localId`;
- nome/endereço do Local no campo Local;
- possível sugestão de modalidade se o Local tiver categoria.

Comportamento visual:

- campo Local deve aparecer preenchido e editável;
- origem deve ser preservada para voltar ao Mapa.

### Fluxo Iniciado Pela Agenda

Entrada por dia selecionado ou CTA na Agenda.

Pré-preenchimentos:

- `data`;
- possível faixa de hora padrão;
- estado de calendário selecionado.

Comportamento visual:

- campo Data deve aparecer preenchido e editável;
- origem deve ser preservada para voltar à Agenda.

### Campos Obrigatórios Visuais

- Local.
- Categoria.
- Título.
- Número mínimo.
- Data.
- Hora de início.
- Hora de fim.
- Descrição ou recomendação quando o contexto exigir.

### Progressão

Criar Ativo deve usar PageTitle + ProgressBar/ProgressIcon quando dividido em etapas. Em telas longas, o progresso deve ficar próximo ao topo e o CTA no final da área de formulário.

## 9. Padrões De Layout

### Mobile-First

A unidade base é 412x917. Toda tela nova deve ser desenhada primeiro para essa largura.

Regras:

- largura de conteúdo comum: 337-382px;
- margem lateral comum: 15-30px;
- menus ocupam 412px;
- campos full-width geralmente variam entre 337px, 379px e 382px;
- cards horizontais usam 349-350px;
- cards compactos podem ter 127px ou 131px.

### Grids

Padrões:

- Home: seções verticais com carrosséis horizontais.
- Preferências: grade/linha de modalidades por ícone.
- Cadastro: campos em pares para dados curtos.
- Agenda: calendário 7 colunas.
- Retrospectiva: blocos de métrica e listas de modalidade.
- Mapa: mapa full-screen + overlays.

### Containers

Containers devem ser usados para organizar conteúdo, não para criar excesso de molduras.

Tipos:

- tela: `surface/base` ou `surface/base2`;
- card: `container/secondary` ou `container/primary`;
- destaque: `container/accent`;
- selecionado: `container/secondary-strong` ou `brand/secondary` em detalhe.

### Scroll

Padrões:

- Home rola verticalmente, com carrosséis internos horizontais.
- Mapa deve evitar scroll principal; usa overlays/listas.
- Agenda pode rolar abaixo do calendário.
- Criar Ativo pode ser longo e vertical.
- Retrospectiva rola verticalmente.
- Menu fixo deve respeitar safe area e não cobrir CTA final.

### Construção De Nova Tela

Para criar uma nova tela consistente:

1. Começar com viewport 412px.
2. Usar `surface/base` ou `surface/base2`.
3. Adicionar `PageTitle` quando a tela for tarefa interna.
4. Usar largura útil entre 337px e 382px.
5. Definir uma única ação primária laranja.
6. Usar cards com raio moderado e sombra curta.
7. Posicionar navegação conforme contexto: bottom para principal, top/reto quando o conteúdo exigir.
8. Preservar Criar Ativo como CTA central quando a navegação principal estiver visível.
9. Não criar paletas locais fora dos tokens.
10. Garantir que texto, ícone e toque caibam em mobile sem sobreposição.

## 10. Biblioteca De Componentes

| Nome | Responsabilidade | Variantes | Reutilização |
| --- | --- | --- | --- |
| `AppScreen` | Base visual 412px, superfície e safe area | light, dark, login, yellow | Todas as telas |
| `PageTitle` | Título, descrição, voltar e ação | padrão, com ação, sem descrição | Zeladoria, Criar Ativo, Agenda, Retrospectiva |
| `Button` | Ações primárias/secundárias | laranja, azul, primário, secundário, com ícone | Todos os fluxos |
| `CircleButton` | Navegação circular e ação central | laranja grande, azul, selecionado, ícone | Menu, atalhos |
| `MainMenu` | Navegação principal | bottom, top, reto | Home, Mapa, Agenda, Conta |
| `TextField` | Entrada de texto | filled, outlined, curto, longo, estados | Login, Cadastro, Conta, Ativo, Zeladoria |
| `Switch` | Alternância binária | ligado, desligado | Cards e preferências |
| `PublicPrivateSwitch` | Privacidade do Ativo | público, privado | Criar Ativo |
| `AtivoHomeCard` | Ativo em descoberta por relevância | padrão, recomendado, destaque | Home |
| `AtivoHorizontalCard` | Ativo em lista temporal | ativo/desativo, colorido/branco | Agenda, listas |
| `LocalCard` | Local em destaque compacto | compacto, claro, colorido | Home, Mapa |
| `LocalListCard` | Local em lista | laranja, azul, claro, colorido | Mapa/lista |
| `ZeladoriaReviewCard` | Revisão de reporte | detalhe, local, fotos | Revisar Zeladoria |
| `ProgressIcon` | Estado de etapa | fazendo, feito, a fazer | Criar Ativo, Zeladoria |
| `ProgressBar` | Linha entre etapas | fazendo, feito, a fazer | Criar Ativo, Zeladoria |
| `AtivoCalendarMarker` | Indicar Ativo no calendário | com ativo, sem ativo | Agenda |
| `CalendarMonth` | Grade mensal | mês atual, dia selecionado, dia com Ativo | Agenda |
| `SearchField` | Busca global/contextual | mapa, home, lista | Home, Mapa |
| `Badge` | Metadado curto | modalidade, quorum, dificuldade, status | Cards |
| `Avatar` | Representação de User | foto, inicial, ícone | Conta, Retrospectiva |
| `Logo` | Identidade da marca | retangular, texto, circular | Login, Onboarding, Header |
| `PhotoUploader` | Adição de fotos | vazio, com foto, erro | Zeladoria |
| `RetrospectiveMetric` | Métrica visual | percentual, número, tempo | Retrospectiva |
| `MapMarker` | Ponto no mapa | padrão, selecionado | Mapa |
| `Header` | Cabeçalho visual compacto | padrão, transparente sobre mapa | Home, Mapa |

### Regra Final De Reutilização

Toda tela nova deve ser construída a partir da biblioteca acima. Componentes novos só devem ser criados quando:

- representarem um padrão não coberto;
- forem reutilizáveis em mais de uma tela;
- usarem tokens oficiais;
- respeitarem a hierarquia mobile-first;
- preservarem Criar Ativo como ação visual central quando aplicável.
