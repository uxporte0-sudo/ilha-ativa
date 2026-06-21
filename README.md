# IlhAtiva - Modelo de Domínio Oficial

## Visão do Produto

O IlhAtiva é uma plataforma comunitária para descoberta, organização e participação em práticas esportivas e recreativas.

Seu objetivo é reduzir as barreiras de acesso ao esporte conectando pessoas, locais e oportunidades de prática.

A entidade central do sistema é o Ativo.

---

# Conceito Fundamental

## O que é um Ativo?

Um Ativo é qualquer oportunidade organizada de prática esportiva ou recreativa que reúna pessoas em um local e horário específicos.

Um Ativo não é necessariamente um evento.

Ele representa uma oportunidade de ativação esportiva.

Exemplos de Ativos:

* Futebol na praia às 18h
* Corrida coletiva de 5km
* Treino aberto de vôlei
* Trilha guiada
* Pedal em grupo
* Aula experimental de yoga
* Caminhada comunitária

Todo o ecossistema do IlhAtiva gira em torno dos Ativos.

---

# Entidades Principais

## User

Representa uma pessoa cadastrada na plataforma.

### Responsabilidades

* Criar Ativos
* Participar de Ativos
* Seguir recomendações
* Reportar problemas
* Gerenciar perfil

### Atributos

* id
* nome
* foto
* email
* telefone
* dataNascimento
* genero
* bio
* preferenciasEsportivas
* configuracoesPrivacidade

---

## Ativo

Representa uma oportunidade organizada de prática esportiva ou recreativa.

É a entidade principal do domínio.

### Responsabilidades

* Reunir participantes
* Organizar uma prática esportiva
* Ocupar um local
* Gerar engajamento comunitário

### Atributos

* id
* titulo
* descricao
* modalidade
* organizadorId
* localId
* dataHoraInicio
* dataHoraFim
* minimoParticipantes
* maximoParticipantes
* nivelDificuldade
* privacidade
* faixaEtaria
* generoPermitido
* status

### Status

* rascunho
* publicado
* confirmado
* realizado
* cancelado

---

## Participacao

Representa a relação entre um usuário e um Ativo.

### Responsabilidades

* Registrar interesse
* Confirmar presença
* Registrar participação efetiva

### Atributos

* id
* ativoId
* userId
* status
* dataConfirmacao

### Status

* interessado
* confirmado
* participou
* cancelado

---

## Local

Representa um espaço onde Ativos podem acontecer.

### Exemplos

* Quadras
* Praças
* Praias
* Trilhas
* Academias parceiras
* Centros esportivos

### Atributos

* id
* nome
* descricao
* categoria
* latitude
* longitude
* endereco
* fotos
* acessibilidade

---

## Zeladoria

Representa um reporte comunitário sobre um local.

### Objetivo

Permitir que usuários ajudem a manter os espaços esportivos utilizáveis e seguros.

### Exemplos

* Rede rasgada
* Iluminação quebrada
* Buraco em quadra
* Lixo acumulado
* Equipamento danificado

### Atributos

* id
* criadorId
* localId
* titulo
* descricao
* fotos
* status
* dataCriacao

### Status

* aberto
* em_analise
* resolvido
* arquivado

---

## Retrospectiva

Representa uma consolidação histórica das atividades realizadas por um usuário.

### Objetivo

Transformar participação esportiva em memória, motivação e engajamento.

### Atributos

* userId
* periodo
* ativosParticipados
* modalidadesPraticadas
* horasAtivas
* locaisVisitados
* novosContatos
* conquistas

---

# Relacionamentos

User
├─ cria → Ativo
├─ participa → Participacao
├─ reporta → Zeladoria
└─ possui → Retrospectiva

Ativo
├─ ocorre em → Local
├─ possui → Participacao
└─ criado por → User

Zeladoria
├─ reportada por → User
└─ associada a → Local

Retrospectiva
└─ consolida dados de → Participacao

---

# Fluxo Principal do Produto

User
↓
Descobre um Ativo
↓
Demonstra interesse
↓
Confirma participação
↓
Participa do Ativo
↓
Gera histórico
↓
Alimenta a Retrospectiva

---

# Fluxo Comunitário

User
↓
Identifica problema em um Local
↓
Cria uma Zeladoria
↓
Comunidade acompanha resolução
↓
Local permanece apto para novos Ativos

---

# Regra Arquitetural

Ativo é a entidade central do sistema.

Toda funcionalidade principal deve estar direta ou indiretamente relacionada a um Ativo.

Se uma nova funcionalidade não puder ser relacionada a um Ativo, um Local, uma Participação, uma Zeladoria ou uma Retrospectiva, sua inclusão no domínio deve ser reavaliada.
