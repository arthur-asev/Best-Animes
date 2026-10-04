# Pendências de arquitetura e operação

Itens ainda sem decisão ou conclusão. O roadmap de implementação está em [`13-roadmap.md`](13-roadmap.md).

1. Qual deve ser o contrato definitivo de `/proxy`, `/stream`, `/sign` e `/key`? O fluxo ativo usa token na query string; há também uma variante de player sem assinatura.
2. Quais hosts de mídia legítimos devem compor `ALLOWED_HOSTS` em produção? Com a variável vazia, o proxy aceita hosts arbitrários.
3. Qual política de CORS deve ser aplicada no domínio de produção? O backend configura CORS aberto.
4. Será necessária autenticação de contas? Hoje não há autenticação de usuários; o JWT existente assina URLs de mídia.
5. `src/config/cache.ts` deve ser integrado ou removido? Não foi identificado consumidor no código da aplicação.
6. Qual arquivo de exemplo de ambiente deve ser canônico? Existem `.env-exemple` e arquivos de ambiente locais; seus conteúdos não foram inspecionados nesta revisão.
7. O Redis configurado anteriormente para Upstash teve a chave renovada? A anotação de 2026-10-03 dizia que ela havia expirado; operações dependentes daquele serviço precisam de confirmação operacional atual.

## Divergência entre servidores

O comando `npm start` do backend inicia `server-test.js`. `backend/server.js` mantém uma implementação anterior do proxy, com contratos e comportamento diferentes. Consolidar ou remover a implementação não usada exige validar compatibilidade com o fluxo de mídia.
