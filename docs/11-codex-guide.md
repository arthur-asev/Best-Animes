# 11 — Guia para Codex/IA

## Objetivo

Este arquivo define como uma IA deve alterar o projeto sem reintroduzir a arquitetura antiga.

## Fonte de verdade

Antes de editar código, ler nesta ordem:

```text
docs/01-architecture.md
docs/02-provider-system.md
docs/03-kuhi-integration.md
docs/04-api-routes.md
docs/05-streaming-flow.md
```

Depois consultar os arquivos reais.

## Regras obrigatórias

### 1. Não adicionar dependência antiga

Não reintroduzir bibliotecas ou providers que pertenciam à arquitetura anterior apenas porque um arquivo histórico menciona essas tecnologias.

### 2. Não chamar Kuhi do React

Errado:

```js
fetch('http://kuhi:8000/anime/...')
```

Correto:

```js
fetch('/api/anime/...')
```

### 3. Provider primeiro

Mudanças de integração com Kuhi devem ficar em:

```text
backend/src/providers/anime/KuhiProvider.js
```

### 4. Não duplicar lógica

Não copiar parsing/normalização para controller, página React ou player se ela já pertence ao provider.

### 5. IDs de episódio

Não inventar outro formato sem atualizar:

- `KuhiProvider`;
- frontend;
- documentação;
- testes.

### 6. Streaming

Não remover `/sign` ou `/stream` apenas para simplificar o código sem analisar a necessidade de proxy/referer/token.

### 7. Docker

Serviços devem usar nomes DNS do Compose:

```text
backend → kuhi:8000
backend → redis:6379
frontend → backend:5000
```

Não trocar esses endereços por `localhost` dentro de containers.

## Processo recomendado para uma alteração

```text
1. Identificar requisito
2. Ler documentação relacionada
3. Localizar código responsável
4. Alterar a menor superfície possível
5. Rodar testes
6. Rodar build
7. Validar Docker
8. Atualizar documentação se o contrato mudou
```

## Antes de finalizar

A IA deve verificar:

```bash
grep -RIn "KUHI_URL" backend src docker-compose.yml
```

E garantir que não criou uma nova integração paralela.

## Regra para refatorações grandes

Não reescrever frontend + backend + provider + Docker em uma única etapa sem necessidade. Fazer mudanças incrementais e validáveis.
