# Mapa de migração — decisão resultante da auditoria

## Arquivos do Consumet a incorporar

**Nenhum arquivo-fonte individual do checkout `api.consumet.org`.** `src/routes/anime/zoro.ts` é wrapper Fastify; implementação Zoro, modelos e extractors efetivos estão no pacote `@consumet/extensions`. Foi selecionada a dependência `@consumet/extensions@1.8.1` e criado adaptador próprio. O pacote contém mais providers do que o projeto usa; o Best-Animes importa somente `ANIME.Zoro`.

Se optar por extração de fonte em vez da dependência, não há lista fechada segura nesta auditoria: o parser/base client/utils/models/extractor são transitivos dentro do pacote e exigem análise/portabilidade adicional.

## Arquivos a descartar da extração

Todos os arquivos-fonte e infraestrutura do checkout Consumet, incluindo `src/main.ts`, `src/routes/anime/zoro.ts` (Fastify wrapper), `src/routes/anime/index.ts`, rotas/providers restantes, grupos manga/books/comics/light-novels/movies/news/meta, `src/utils/*` da API, `demo/`, Docker/deploy configs e manifests/scripts Consumet. Também não copiar `node_modules`, lockfile Consumet, builds, caches, `.env`, tokens ou credenciais. Preservar os avisos/licenças aplicáveis ao pacote se a dependência for aprovada.

## Conflitos que a integração precisa resolver

1. `backend/server.js` usa Redis indefinido e difere de `server-test.js`; escolher e consolidar Express sem perder playback HLS.
2. O frontend chama serviços/origens locais e externos incompatíveis; catálogo Zoro, gêneros e endpoints chamados hoje não existem no backend.
3. Top-airing e Yuma search/recent são consumidos pelo frontend, mas P0 limita Zoro a search/info/watch.
4. Não existe autenticação de conta/permissões; JWT atual protege URLs de mídia. Não assumir que constitui sessão de usuário.
5. Proxy aceita host arbitrário quando allowlist vazia; URLs, headers referer, SSRF, rate limits e exposição de token precisam solução.
6. Redis/cache existente aparece em mais de um lugar e `src/config/cache.ts` não tem import identificado.
7. Scripts, README e env examples estão inconsistentes.
8. MIT/GPL divergem nos artefatos Consumet; a decisão operacional do proprietário é usar MIT no projeto. A divergência e o LICENSE incluído no pacote estão preservados em `LICENSE-REVIEW.md`.

## Arquitetura final proposta

```text
Next.js frontend (contratos próprios /api)
        ↓ HTTP
Express API única em backend
  ├── middleware global: Helmet, CORS, rate limit e validação de entrada
  ├── auth/permissões: somente após definir mecanismo de conta
  ├── anime router → controller → AnimeService → AnimeProvider → ZoroProvider → extensão Consumet
  ├── proxy HLS próprio, restrito e integrado (contratos definidos na implementação)
  ├── cache abstraction; Redis opcional
  └── manga router/service/provider interface sem implementação concreta
```

Preservar Next UI, Redux e capacidades HLS; expor P0 `/api/anime/search`, `/info/:id`, `/watch/:episodeId`; preparar Manga sem provider. Migrar/decidir os contratos atualmente usados antes de remover origens antigas. Frontend não chama Consumet, Zoro, Yuma nem Jikan diretamente. Nada disso foi implementado nesta auditoria.

## Etapa de integração iniciada

Na branch `feat/consumet-integration`, foi criada a camada própria de Anime (`routes → controller → service → provider boundary`) e a interface futura de Manga. Após decisão explícita do proprietário para usar MIT, o adaptador Zoro foi ligado via `@consumet/extensions@1.8.1`. O backend expõe `/api/anime/search?q=`, `/api/anime/info/:id`, `/api/anime/watch/:episodeId`, `/api/anime/top-airing`, `/api/anime/recent-episodes` e `/api/anime/genres`. `/api/manga/*` retorna `501 manga_provider_unavailable` sem fingir existir provider.

O Next encaminha `/api/*` ao backend próprio em `localhost:5000`; páginas de info/watch, Home search/recent episodes, gêneros e carrossel usam esses contratos. O proxy HLS continua no backend existente. A origem Yuma foi removida do frontend.
