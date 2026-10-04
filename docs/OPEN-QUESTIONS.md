# Questões em aberto da auditoria

1. A decisão operacional do proprietário é usar MIT para o projeto e a integração. Continua documentada a divergência entre o campo MIT e o arquivo GPL-3 dentro de `@consumet/extensions@1.8.1`; ver `LICENSE-REVIEW.md`.
2. O Best-Animes será distribuído publicamente, privado ou oferecido como serviço? O projeto raiz e backend declaram MIT.
3. Yuma foi substituído por Zoro em search e recent episodes; confirmar equivalência funcional visualmente com dados ao vivo.
4. Resolvido nesta etapa: o carrossel e gêneros usam endpoints do provider Zoro via API própria.
5. Qual contrato final de `/proxy`, `/stream`, `/sign` e `/key`? Frontend e servidores Express divergem; token de stream hoje é posto em query string.
6. Quais hosts HLS legítimos precisam da allowlist? `server-test.js` permite todos quando `ALLOWED_HOSTS` é vazia.
7. Que mecanismo de autenticação de conta e autorização será adotado? Nenhum foi encontrado; JWT atual é para mídia.
8. `src/config/cache.ts` não tem import consumidor identificado; é parte ativa de uma integração planejada?
9. Qual env example é canônico? Existem `.env`, `backend/.env` e `.env-exemple`; conteúdo dos envs foi deliberadamente não inspecionado.
10. No início, `backend/Best-Animes.code-workspace` e `docs/` estavam não rastreados no Git do Best-Animes. Devem ser preservados na próxima fase.

## Atualização da etapa de integração

- Naquele estado intermediário, a escolha de licença era a pendência para ligar Zoro; decisão do proprietário e implementação foram registradas abaixo.
- `BACKEND_URL` pode ser definido no ambiente do Next para chamadas server-side de info/watch; por padrão usa `http://localhost:5000`.
- O legado `backend/server.js` ainda diverge do servidor funcional `backend/server-test.js`. O script `npm start` do backend agora seleciona `server-test.js`; consolidar a duplicação exige migração cuidadosa do proxy HLS e continua em aberto.
- O fluxo `/sign` e proxy de mídia permanecem contratos próprios legados, ainda sem consolidação.

## Validação da continuação — 2026-10-03

- `npm test` em `backend/`: passou (2 testes do `AnimeService`).
- `npm run build` na raiz: passou; Next compilou, executou TypeScript e gerou páginas estáticas.
- O aviso de dados `baseline-browser-mapping`/`caniuse-lite` desatualizados não impediu o build.
- Nesse estado intermediário, a dependência ainda não estava adicionada e Zoro permanecia desligado pela decisão de licença pendente.
- A continuidade passou a integrar o provider após a decisão MIT descrita em `LICENSE-REVIEW.md`.

## Atualização após decisão MIT — 2026-10-03

- A dependência `@consumet/extensions@1.8.1` foi adicionada ao backend e o provider Zoro agora atende search, info, watch, top-airing e gêneros pela API própria.
- O frontend de gêneros passou a chamar `/api/anime/genres`; top-airing já consumia `/api/anime/top-airing`.
- Home search e recent episodes agora usam endpoints da API própria, atendidos pelo provider Zoro.
- O `npm install` reportou 11 vulnerabilidades na árvore backend (3 moderadas, 8 altas).
- `npm test` em `backend/`: passou (5 testes). `npm run build` na raiz: passou.
- Smoke test de inicialização: `/health` respondeu `{"status":"ok"}`. O Redis configurado é Upstash e o proprietário informou que a chave expirou; operações dependentes do Redis precisam da chave renovada.
