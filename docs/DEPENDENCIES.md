# Dependências — auditoria Zoro

Análise estática dos imports e da árvore instalada no checkout Consumet; dependências não foram instaladas ou atualizadas nesta auditoria.

## Projetos atuais

- Best-Animes frontend: Next.js/React, Axios, Redux Toolkit/React-Redux/redux-persist, Video.js/plugins, Slick, FontAwesome, Tailwind/PostCSS e TypeScript.
- Best-Animes backend: Express, Axios, CORS, dotenv, Helmet, express-rate-limit, ioredis, jsonwebtoken, node-fetch e TypeScript.
- Consumet API: Fastify e CORS Fastify, `@consumet/extensions`, Axios, Cheerio, dotenv, ioredis, websocket packages, chalk, ts-node e tooling TypeScript/Prettier. Os pacotes da API que não pertencem à extensão não são requisitos do adaptador Zoro.

## Cadeia funcional observada

```text
adaptador Express próprio
└── @consumet/extensions@1.8.1 (commit do lock 3d83c3d...)
    └── ANIME.Zoro
        ├── AnimeParser / BaseParser, cliente HTTP, tipos e utils do pacote
        ├── Cheerio para parsing HTML
        └── fetchEpisodeSources
            └── extractor selecionado (RapidCloud em caminhos compatíveis)
                ├── parsers e utils do pacote
                ├── CryptoJS em extração/descriptografia aplicável
                └── Axios/HTTP
```

O `package.json` instalado da extensão declara dependências diretas `ascii-url-encoder`, `axios`, `cheerio`, `crypto-js`, `domhandler`, `form-data`, `husky`. A extensão encapsula sua própria cadeia; o Best-Animes não deve declarar cópias avulsas sem provar que os importa diretamente. `husky` aparenta ferramenta, mas consta como dependency do pacote publicado. Dependências transitivas e opcionais devem ser preservadas pelo package manager, não copiadas à mão.

## Decisão técnica preliminar

Manter exatamente a dependência `@consumet/extensions` pinada ao commit auditado é a opção de menor divergência funcional. O pacote inclui código além do Zoro e há divergência de licença pendente. Extração seletiva requer portar recursivamente parser, modelos, utils e extractors e validar contra o provider; não foi demonstrada como pequena nem equivalente. Nenhuma dependência Consumet foi adicionada nesta auditoria.
