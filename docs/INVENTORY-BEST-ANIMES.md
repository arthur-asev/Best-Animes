# Inventário atual — Best-Animes

Resumo estático do código e da configuração. Não inclui leitura de secrets nem validação de serviços externos.

## Estrutura

- Frontend: Next.js 16 / React 19, em `src/app` e `src/components`.
- Backend: Express em `backend/`; `npm start` executa `server-test.js`.
- Provider de anime: `KuhiProvider`, conectado às rotas em `backend/src/routes/animeRoutes.js`.
- Infraestrutura: `docker-compose.yml` define frontend, backend, Kuhi e Redis.
- Testes do backend: `KuhiProvider` e `AnimeService`, em `backend/test/`.

## Rotas de catálogo

O frontend consome a API própria do backend:

| Rota | Responsabilidade |
|---|---|
| `GET /api/anime/search?q=&page=` | Busca |
| `GET /api/anime/info/:id` | Detalhes e episódios |
| `GET /api/anime/watch/:episodeId` | Fontes e legendas |
| `GET /api/anime/top-airing?page=` | Catálogo em destaque |
| `GET /api/anime/recent-episodes?page=` | Episódios recentes |
| `GET /api/anime/genres` | Gêneros |
| `GET /api/anime/providers/status` | Status dos providers do Kuhi |

O frontend não chama o Kuhi diretamente. Os IDs de episódio internos usam `kuhi:<anilistId>:<episode>:sub|dub`.

## Proxy e configuração

- `backend/server-test.js` contém `/sign`, `/proxy`, `/stream`, `/key`, `/clear-cache` e `/health`.
- `backend/server.js` mantém uma implementação anterior, com contratos divergentes; não é o alvo do script `npm start`.
- `src/config/cache.ts` não tem import consumidor identificado.
- A allowlist de hosts e a origem CORS precisam de configuração restritiva para produção; ver [`08-proxy-security.md`](08-proxy-security.md).
- Há manifests e lockfiles separados na raiz e em `backend/`. O exemplo de ambiente do repositório é `.env-exemple`; arquivos locais não foram inspecionados.

Este inventário descreve o estado observado no código e deve ser atualizado quando rotas, scripts ou serviços mudarem.
