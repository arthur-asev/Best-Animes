# 02 — Sistema de Providers

## Contrato

A abstração principal está em:

```text
backend/src/providers/anime/AnimeProvider.js
```

O serviço `AnimeService` depende dessa abstração e não conhece detalhes do provider.

Operações principais:

```js
search(query, page)
getInfo(id)
getWatchSources(episodeId, options)
```

O projeto atual também usa operações específicas para catálogo:

```js
getTopAiring(page)
getRecentEpisodes(page)
getGenres()
getProviderStatus()
```

## KuhiProvider

Arquivo:

```text
backend/src/providers/anime/KuhiProvider.js
```

Responsabilidades:

1. Fazer chamadas HTTP ao Kuhi.
2. Normalizar resultados para o contrato do Best-Animes.
3. Converter episódios do Kuhi para IDs internos.
4. Converter streams `hls`, `mp4` e `dash` para MIME types.
5. Preservar o `referer` necessário para reprodução.
6. Expor legendas recebidas do Kuhi.

## Configuração

```env
KUHI_URL=http://kuhi:8000
KUHI_TIMEOUT_MS=15000
```

Em execução local sem Docker:

```env
KUHI_URL=http://127.0.0.1:8000
```

## Normalização de anime

O provider tenta obter o AniList ID de:

```text
anilistId
id
mediaId
media.id
```

O título pode vir de diferentes formatos e é reduzido a uma string utilizável pelo frontend.

## Normalização de episódio

Cada episódio recebe:

```json
{
  "id": "kuhi:21:1:sub",
  "animeId": "21",
  "number": 1,
  "title": "Episode 1",
  "isSubbed": true,
  "isDubbed": false,
  "audio": "sub"
}
```

## Normalização de stream

Kuhi pode retornar tipos como:

| Kuhi | Best-Animes |
|---|---|
| `hls` | `application/x-mpegURL` |
| `mp4` | `video/mp4` |
| `dash` | `application/dash+xml` |
| `embed` | preservado para tratamento específico |

Quando um stream possui `referer`, ele é preservado em `headers.Referer`.

## Por que não colocar lógica Kuhi em `AnimeController`?

Porque o controller deve tratar HTTP e erros, enquanto o provider trata integração externa. Essa separação reduz o acoplamento e facilita criar outro provider no futuro.
