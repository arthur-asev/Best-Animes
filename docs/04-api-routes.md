# 04 — API do Backend

Base local:

```text
http://localhost:5000
```

## Anime

### Buscar

```http
GET /api/anime/search?q=<termo>&page=1
```

`q` é obrigatório.

### Informações

```http
GET /api/anime/info/:id
```

O `id` é o AniList ID.

### Assistir

```http
GET /api/anime/watch/:episodeId
```

Exemplo:

```text
/api/anime/watch/kuhi:21:1:sub
```

Opção de áudio:

```text
?dub=true
```

### Top airing

```http
GET /api/anime/top-airing?page=1
```

### Episódios recentes

```http
GET /api/anime/recent-episodes?page=1
```

### Gêneros

```http
GET /api/anime/genres
```

### Status dos providers

```http
GET /api/anime/providers/status
```

Essa rota consulta o endpoint de status do Kuhi.

## Proxy e reprodução

### Healthcheck

```http
GET /health
```

Resposta esperada:

```json
{"status":"ok"}
```

### Assinar URL

```http
POST /sign
x-api-key: <SIGN_API_KEY>
Content-Type: application/json
```

Body:

```json
{
  "url": "https://cdn.example/master.m3u8",
  "referer": "https://example.com/",
  "expiresIn": 120
}
```

Resposta:

```json
{"token":"..."}
```

### Stream

```http
GET /stream?token=<jwt>&referer=<referer>
```

O backend valida o JWT e busca o recurso remoto.

### Proxy legado/alternativo

```http
GET /proxy?token=<jwt>&referer=<referer>
```

O endpoint mantém a proteção adicional de `x-player-auth` quando `REQUIRE_PLAYER_HEADER=true`.

### Limpar cache

```http
POST /clear-cache
x-api-key: <SIGN_API_KEY>
```

Disponível apenas quando Redis está configurado.

## Erros principais

| HTTP | Significado |
|---:|---|
| 400 | Requisição inválida |
| 403 | Token, API key ou host não autorizado |
| 429 | Limite de requisições/token |
| 502 | Falha do provider/upstream |
| 503 | Provider não configurado |

## Regra de compatibilidade

Alterações no contrato das rotas devem ser feitas com cuidado porque o frontend depende dessas rotas diretamente ou através dos rewrites do Next.js.
