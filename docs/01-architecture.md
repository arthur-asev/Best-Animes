# 01 — Arquitetura

## Objetivo

O Best-Animes é uma aplicação web de descoberta e reprodução de anime. O frontend é responsável pela interface; o backend Express funciona como API Gateway e camada de proxy; o Kuhi é o provedor de catálogo e extração de streams; Redis suporta cache e otimizações do proxy.

## Componentes

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | Next.js 16 + React 19 | UI, páginas, busca, catálogo e player |
| Backend | Node.js + Express | API própria, adaptação do provider, assinatura e proxy |
| Provider | `KuhiProvider` | Traduz o contrato interno para a API Kuhi |
| Kuhi | FastAPI/Python | Metadados, episódios e extração de streams |
| Redis | Redis 7 | Cache de manifests/segmentos e rate limiting auxiliar |
| Player | Video.js | Reprodução HLS e legendas |

## Princípio de desacoplamento

O frontend não conhece detalhes do Kuhi. Ele conhece somente as rotas do Best-Animes:

- `/api/anime/search`
- `/api/anime/info/:id`
- `/api/anime/watch/:episodeId`
- `/api/anime/top-airing`
- `/api/anime/recent-episodes`
- `/api/anime/genres`
- `/api/anime/providers/status`

Isso permite substituir o Kuhi futuramente sem reescrever o frontend.

## Identidade

O projeto usa o **AniList ID** como identidade canônica do anime.

Os IDs de episódio são internos e seguem:

```text
kuhi:<anilistId>:<episode>:sub
kuhi:<anilistId>:<episode>:dub
```

Exemplo:

```text
kuhi:21:1:sub
```

O ID interno evita expor ou depender de IDs específicos dos providers do Kuhi.

## Fluxo de busca

```text
Frontend
  → GET /api/anime/search?q=naruto
Backend Controller
  → AnimeService
  → KuhiProvider.search()
  → Kuhi GET /anime/search
  ← normalização
  ← JSON do backend
```

## Fluxo de detalhes

```text
Frontend
  → /api/anime/info/21
Backend
  → Kuhi /anime/info/21
  → Kuhi /anime/episodes/21
  → junta e normaliza episódios
  ← anime + episodes
```

## Fluxo de reprodução

```text
Frontend
  → /api/anime/watch/kuhi:21:1:sub
Backend
  → Kuhi /anime/extract/21?e=1&type=sub
  ← stream + referer + subtitles
Frontend
  → POST /sign
  ← JWT curto
Frontend
  → /stream?token=...
Backend
  → upstream CDN
  ← HLS
```

## Regra arquitetural

Não adicionar chamadas diretas ao Kuhi dentro de componentes React. Toda comunicação com o provider deve passar por `KuhiProvider`.
