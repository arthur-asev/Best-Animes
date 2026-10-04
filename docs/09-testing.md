# 09 — Testes e Validação

## Backend

O `package.json` do backend define:

```bash
npm test
```

que executa:

```bash
node --test test/*.test.js
```

## Validação rápida

### Backend

```bash
cd backend
npm test
```

### Sintaxe

```bash
node --check server-test.js
node --check src/providers/anime/KuhiProvider.js
```

### Frontend

```bash
npm run build
```

### Docker

```bash
docker compose config
```

## Teste manual do backend

```bash
curl http://localhost:5000/health
```

Busca:

```bash
curl "http://localhost:5000/api/anime/search?q=naruto&page=1"
```

Detalhes:

```bash
curl "http://localhost:5000/api/anime/info/21"
```

Status dos providers:

```bash
curl "http://localhost:5000/api/anime/providers/status"
```

## Teste de reprodução

1. Buscar um anime.
2. Abrir os detalhes.
3. Confirmar episódios com IDs `kuhi:*`.
4. Abrir um episódio.
5. Confirmar resposta de `/api/anime/watch/...`.
6. Confirmar chamada a `/sign`.
7. Confirmar requisição `/stream`.
8. Verificar manifesto e segmentos no DevTools.

## Teste de falha do Kuhi

Desligar o serviço:

```bash
docker compose stop kuhi
```

A API deve responder com erro de provider/upstream, e o frontend não deve travar indefinidamente.

Depois:

```bash
docker compose start kuhi
```

## Critérios de aceitação

Uma alteração é considerada segura quando:

- não quebra as rotas públicas;
- não remove a abstração `AnimeProvider`;
- não introduz chamadas diretas ao Kuhi no frontend;
- mantém a reprodução HLS funcionando;
- passa build/testes relevantes;
- mantém Docker saudável.
