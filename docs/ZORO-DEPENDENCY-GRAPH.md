# Grafo de imports e dependências Zoro

Reconstruído estaticamente em 2026-10-03 a partir de `src/routes/anime/zoro.ts` e do pacote instalado no lock do checkout Consumet (`@consumet/extensions@1.8.1`, commit `3d83c3d215ccf0ce4c94fde6097cfbbba4253dab`).

```text
Best-Animes (proposta)
└── Router → Controller → AnimeService → AnimeProvider
    └── ZoroProvider (adaptador próprio)
        └── @consumet/extensions: ANIME.Zoro
            └── providers/anime/zoro.js
                ├── cheerio
                ├── AnimeParser → BaseParser / cliente HTTP
                ├── utils e modelos comuns da extensão
                └── fetchEpisodeSources(episodeId, server, subOrDub)
                    └── extractor escolhido na extensão (RapidCloud em caminhos aplicáveis)
                        ├── modelos VideoExtractor e utils
                        ├── CryptoJS em caminhos aplicáveis
                        └── Axios
```

## Uso da rota Consumet como referência

`src/routes/anime/zoro.ts` faz parsing dos parâmetros, valida `StreamingServers`, converte `dub` em `SubOrSub` e traduz erros para respostas Fastify. Ela pode servir como referência de parâmetros/comportamento; sua rota e dependência de Fastify não devem ser incorporadas.

## Fora do grafo de import do provider

`src/main.ts`, `src/routes/anime/index.ts`, demais rotas/providers, `src/utils/key.ts`, utilitário websocket `src/utils/rapid-cloud.ts`, `src/utils/m3u8-proxy.ts`, cache/Utils da API, grupos manga/books/movies/news/comics/meta e configuração de deploy. A distribuição do pacote `@consumet/extensions`, porém, contém mais módulos do que este grafo importa.
