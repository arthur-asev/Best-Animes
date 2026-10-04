# Mapa de rotas atual e proposta

## Best-Animes

| Verbo e rota | Origem | Observação |
|---|---|---|
| GET `/proxy?url=` | `backend/server.js`, `server-test.js` | HLS; diferença nos controles/headers |
| GET `/stream?url=` ou `?token=&referer=` | ambos | Contrato diverge |
| GET `/clear-cache` | `server.js` | Sem proteção aparente |
| POST `/clear-cache` | `server-test.js` | Requer chave API |
| POST `/sign` | `server-test.js` | Emite JWT de mídia, não autentica conta |
| GET `/key` | `server-test.js` | Placeholder binário |
| GET `/health` | `server-test.js` | Healthcheck |
| `/api/anime/*`, `/genreslist` | Chamadas do frontend | Implementação não encontrada no backend |

`server-test.js` instala Helmet, rate limit, filtro de user-agent e validação de host opcional. Não há middleware de login ou autorização por permissões.

## Consumet: montagem Zoro

Composição: `src/main.ts` registra anime sob `/anime`; `src/routes/anime/index.ts` registra Zoro sob `/zoro`; assim, base `/anime/zoro`.

| Rota Consumet | Método do provider | Escopo inicial |
|---|---|---|
| GET `/anime/zoro/:query?page=` | `search(query,page)` | Incorporar comportamento via rota própria `/api/anime/search?q=` |
| GET `/anime/zoro/info?id=` | `fetchAnimeInfo(id)` | Incorporar via `/api/anime/info/:id` (contrato alvo muda de query para path) |
| GET `/anime/zoro/watch` ou `/watch/:episodeId?server=&dub=` | `fetchEpisodeSources` | Incorporar via `/api/anime/watch/:episodeId` |
| recent-episodes, top-airing, popular, genre, schedule e demais rotas documentadas em `zoro.ts` | diversos | Fora do P0; `top-airing` é chamado pelo frontend hoje e precisa decisão de continuidade |

O frontend também chama Yuma (`search`, recentes), `/genreslist` e usa proxy de mídia. Consolidar tudo em uma API própria implica decidir como manter esses contratos, não apenas adicionar as três rotas Zoro P0.

## Arquitetura conceitual

Express Router → middleware aplicável → Controller → Service → interface Provider → `ZoroProvider`. O proxy HLS e seus contratos precisam de consolidação própria. A estrutura final e limites estão em `MIGRATION-MAP.md`.
