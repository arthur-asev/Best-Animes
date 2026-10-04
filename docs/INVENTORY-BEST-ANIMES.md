# Inventário — Best-Animes

Auditoria estática em 2026-10-03. Nenhum código da aplicação foi alterado. `.env` não foi lido nem copiado.

## Estrutura e execução

- Frontend em Next.js 16 / React 19, em `src/app` e `src/components`; scripts de raiz: `dev`, `build`, `start`. README ainda descreve Create React App e scripts Yarn antigos.
- Backend Express independente em `backend/server.js` e `backend/server-test.js`. O `backend/package.json` não tem script de start e seu único teste é o placeholder que termina em erro.
- Há manifests/lockfiles separados na raiz e em `backend/`. Não foi identificado Docker na raiz.
- Git inicial: branch `V0.1`; `backend/Best-Animes.code-workspace` e `docs/` já estavam não rastreados. Preservados.
- Env files existentes: `.env`, `backend/.env`, `.env-exemple`; também foi referenciado `.env.example` em inventário prévio, mas não confirmado nesta varredura. Conteúdos secretos não foram inspecionados.

## Frontend, dados e chamadas HTTP

| Arquivo | Chamada observada | Consequência |
|---|---|---|
| `src/components/Home/Home.jsx` | `https://yumaapi.vercel.app/recent-episodes`, `/search/:title` | Dependência direta de API externa Yuma |
| `src/components/Carrousel/carousel.jsx` | `/api/anime/top-airing` | Endpoint relativo; backend correspondente não encontrado |
| `src/app/animedetail/[id]/page.tsx` | `http://localhost:3000/api/anime/info?id=...` | API de catálogo não encontrada; contrato usa query id |
| `src/app/watchanime/[id]/page.tsx` | `http://localhost:3000/api/anime/watch/:id` | API de catálogo não encontrada |
| `src/app/genres/page.jsx` | `http://localhost:3000/genreslist` | API não encontrada |
| `src/components/VideoJSPlayer/videojs-player.jsx` | `POST localhost:5000/sign`, depois `/stream?token=&referer=` | Proxy de mídia separado; chave pública de cliente referenciada |
| `src/components/VideoJSPlayer/video-player-sem-auth.jsx` | `/proxy?url=...&referer=...` | Variante de proxy sem assinatura |

`src/config/cache.ts` define cliente/cache Redis, mas não foi encontrado import consumidor no código da aplicação. A interface é isolada; confirmar antes de remover.

## Backend, rotas e middleware

- `server-test.js`: middleware `express.json`, CORS, Helmet (CSP desabilitada), rate limit global, bloqueio por user-agent; JWT assinado para URLs de mídia; allowlist de host é opcional e lista vazia permite qualquer host; Redis/cache tratado como opcional; pré-busca HLS. Rotas: `POST /sign`, `GET /proxy`, `GET /stream`, `GET /key`, `POST /clear-cache`, `GET /health`.
- `server.js`: CORS e proxy HLS, sem middleware de conta. Instanciação Redis está comentada, embora `redis.ping()` e handlers usem `redis`; execução falha por referência indefinida. Rotas: `GET /proxy`, `GET /stream`, `GET /clear-cache`.
- Os servidores diferem em assinatura, parâmetros, método de limpeza e segurança. `/key` em `server-test.js` entrega bytes placeholder. Tokens em query string podem aparecer em logs/histórico.
- Não há rotas de login/register, autenticação de usuários ou autorização por permissões; JWT do proxy é autorização de recurso de mídia, não sessão de usuário. Não há catálogo Zoro nem Jikan no backend.

## Dependências declaradas

Frontend inclui Next/React, Axios, Redux, Video.js e plugins, Slick, FontAwesome, Tailwind/PostCSS e TypeScript. Backend inclui Express, Axios, CORS, dotenv, Helmet, express-rate-limit, ioredis, jsonwebtoken, node-fetch, TypeScript e `@types/node`. `node-fetch` não foi encontrado nos imports dos dois servidores. Inventário não equivale a auditoria transitiva de vulnerabilidades.
