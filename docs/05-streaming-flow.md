# 05 — Fluxo de Streaming

## Visão geral

O streaming possui duas etapas distintas:

1. **Descoberta da fonte** pelo Kuhi.
2. **Entrega/proxy da fonte** pelo backend do Best-Animes.

## Etapa 1 — Descoberta

```text
Watch page
  ↓
GET /api/anime/watch/kuhi:21:1:sub
  ↓
KuhiProvider.getWatchSources()
  ↓
GET Kuhi /anime/extract/21?e=1&type=sub
  ↓
Kuhi escolhe/extrai uma fonte
```

O retorno pode conter:

- streams HLS;
- MP4;
- DASH;
- embeds;
- legendas;
- referer;
- provider vencedor.

## Etapa 2 — Assinatura

O player usa a primeira fonte compatível e chama:

```text
POST /sign
```

A assinatura contém a URL upstream e o referer e é protegida pela `SIGN_API_KEY`.

## Etapa 3 — Reprodução

O player recebe:

```text
/stream?token=<jwt>&referer=<referer>
```

O backend:

1. valida o JWT;
2. recupera URL e referer;
3. valida o host permitido;
4. busca o upstream;
5. quando necessário, reescreve o manifesto HLS;
6. assina URLs subsequentes;
7. entrega os dados ao player.

## HLS

Manifestos `.m3u8` são tratados de forma diferente de segmentos.

A implementação atual usa TTL curto para manifesto e TTL mais longo para segmentos assinados/reutilizados pelo proxy.

O backend também pode pré-carregar alguns segmentos em Redis para reduzir latência percebida.

## Referer

Alguns CDNs exigem `Referer`. O `KuhiProvider` preserva o referer recebido do Kuhi e o backend o reutiliza nas requisições upstream.

Não remover essa informação durante a normalização sem verificar o impacto no player.

## Legendas

As legendas retornadas pelo Kuhi são transformadas em tracks do Video.js, exceto entradas identificadas como thumbnails.

## Limitação importante

O fluxo atual assume HLS no player principal. Embora o Kuhi possa retornar MP4 e DASH, a implementação do `VideoJSPlayer` está preparada prioritariamente para HLS.
