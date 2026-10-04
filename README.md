# Best-Animes

Aplicação web para descoberta e reprodução de anime com arquitetura desacoplada entre frontend, backend e provider de streaming.

## Arquitetura atual

```text
┌──────────────────────┐
│      Next.js         │
│      React 19        │
└──────────┬───────────┘
           │ /api, /sign, /stream
           ▼
┌──────────────────────┐
│   Express Backend    │
│ API + Proxy + JWT    │
└───────┬───────┬──────┘
        │       │
        │       └──────────────┐
        ▼                      ▼
┌──────────────┐       ┌──────────────┐
│     Kuhi     │       │    Redis     │
│ FastAPI/Py   │       │    Cache     │
└──────┬───────┘       └──────────────┘
       │
       ▼
 Native providers
```

## Componentes

- **Frontend:** Next.js 16, React 19, Video.js.
- **Backend:** Node.js, Express, JWT, Redis, proxy HTTP/HLS.
- **Provider:** `KuhiProvider`.
- **Kuhi:** serviço Python/FastAPI externo ao domínio do frontend.
- **Redis:** cache e otimizações de streaming.

O Kuhi documenta atualmente uma API experimental com providers nativos, corrida de providers e endpoints de extração/streaming. A disponibilidade do upstream não é garantida. citeturn0search0

## Subir com Docker

```bash
docker compose up -d --build
```

Aplicação:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000/health
```

## Variáveis principais

Copie `.env-exemple` para `.env` e ajuste os valores:

```env
SIGN_API_KEY=...
STREAM_SECRET=...
PROXY_HOST=http://localhost:5000
KUHI_REPO=https://github.com/aryaniiil/anime-api.git
KUHI_REF=main
KUHI_TIMEOUT_MS=15000
```

Para produção, use secrets fortes e configure `ALLOWED_HOSTS`/CORS de forma restritiva.

## API principal

```text
GET /api/anime/search?q=<term>
GET /api/anime/info/:id
GET /api/anime/watch/:episodeId
GET /api/anime/top-airing
GET /api/anime/recent-episodes
GET /api/anime/genres
GET /api/anime/providers/status
```

## ID de episódio

O backend usa:

```text
kuhi:<anilistId>:<episode>:sub
kuhi:<anilistId>:<episode>:dub
```

Exemplo:

```text
kuhi:21:1:sub
```

## Desenvolvimento

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm start
```

## Validação

```bash
npm run build
```

Backend:

```bash
cd backend
npm test
```

Docker:

```bash
docker compose config
docker compose ps
```

## Documentação

A documentação completa está em [`docs/`](docs/README.md).

Comece por:

1. `docs/01-architecture.md`
2. `docs/02-provider-system.md`
3. `docs/03-kuhi-integration.md`
4. `docs/05-streaming-flow.md`
5. `docs/06-docker.md`
6. `docs/11-codex-guide.md`

Consulte a documentação atual em `docs/README.md`.

## Licença

Consulte `LICENSE`.
