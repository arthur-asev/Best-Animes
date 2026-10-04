# Inventário — api.consumet.org

Auditoria estática em 2026-10-03 do checkout `../api.consumet.org`; não editado. `git status` inicial do checkout estava limpo em `main`.

## Estrutura

- API Node/TypeScript em Fastify. `src/main.ts` registra `books`, `anime`, `manga`, `light-novels`, `movies`, `meta`, `news` e `Utils`; `comics` é importado mas seu registro está comentado.
- `src/routes/anime/index.ts` registra diversos providers e tem redirecionamento genérico via `PROVIDERS_LIST`; a rota Zoro é registrada em `/anime/zoro`.
- Outros grupos incluem manga, comics, light novels, news, movies, books, meta. Há demo e configurações de deploy (Dockerfiles, Render, Vercel, AppSpec etc.). Nenhuma dessas estruturas é necessária para o adaptador no Express.
- O checkout contém lockfile e `node_modules`; nenhum deve ser copiado.

## Rota Zoro e implementação real

- `src/routes/anime/zoro.ts` instancia `new ANIME.Zoro(process.env.ZORO_URL)` de `@consumet/extensions` e define wrappers Fastify para busca, info, watch e outros métodos.
- Para escopo P0, as chamadas necessárias são `search(query, page?)`, `fetchAnimeInfo(id)` e `fetchEpisodeSources(episodeId, server?, subOrDub?)`.
- O checkout da API não versiona a implementação Zoro. O pacote instalado `@consumet/extensions@1.8.1` resolve no lock para commit `3d83c3d215ccf0ce4c94fde6097cfbbba4253dab`; a implementação está no `node_modules` do pacote, sob `dist/providers/anime/zoro.js`.
- O provider usa Cheerio, hierarquia de parser/modelos, utils e cliente HTTP herdados da extensão. Watch encaminha para extractors da extensão (incluindo RapidCloud conforme servidor escolhido), com dependências como CryptoJS. Importar só `ANIME.Zoro` não transforma o pacote publicado numa distribuição só de Zoro: os providers e extractors restantes continuam presentes.
- `src/utils/rapid-cloud.ts` da API Consumet é utilitário websocket separado e não deve ser confundido com o extractor RapidCloud empacotado na extensão. `src/utils/key.ts`, cache, proxy M3U8, `Utils` e as rotas Fastify não são dependências diretas da classe instalada.

## Licença e limites da evidência

`api.consumet.org/LICENSE` contém GPL-3, enquanto `package.json` da API e metadados de `@consumet/extensions@1.8.1` dizem MIT; o pacote também contém arquivo `LICENSE` GPL-3. A divergência permanece sem resolução. Ver `LICENSE-REVIEW.md`; não se concluiu compatibilidade nem se copiou fonte.
