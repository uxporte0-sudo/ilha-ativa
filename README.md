# Ilha Ativa

Protótipo React/Vite preparado para rodar localmente em modo UI-only, sem banco de dados e sem runtime Base44.

## Como rodar

```bash
npm install
npm run dev
```

Para gerar build de produção:

```bash
npm run build
npm run preview
```

## Modo UI-only

A camada de dados em `src/api/base44Client.js` é um mock local. As consultas retornam listas vazias, e criações/atualizações retornam objetos temporários apenas para manter a interface funcionando.

Quando for conectar um backend real, substitua essa camada por chamadas HTTP mantendo os mesmos métodos usados pelas telas: `list`, `filter`, `get`, `create`, `update` e `delete`.
