# 07 — Redis

## Funções

O Redis é utilizado pelo backend principalmente para:

- cache de conteúdo remoto;
- cache de segmentos;
- rate limiting auxiliar por token;
- pré-carregamento de segmentos HLS.

## Conexão

Docker:

```env
SERVER_API_REDIS_CONN_URL=redis://redis:6379
```

A classe de cache do frontend/backend só habilita a conexão quando a variável existe.

## TTLs relevantes

Na implementação do proxy:

- manifesto HLS: TTL muito curto;
- segmentos: até aproximadamente 1 hora no cache remoto;
- tokens de manifesto: aproximadamente 60 segundos em reescritas internas;
- tokens de segmentos: aproximadamente 2 horas em reescritas internas.

Esses valores são detalhes de implementação e podem mudar; ao alterar, atualizar esta documentação.

## Pré-fetch

Configurações:

```env
PREFETCH_SEGMENTS=6
PREFETCH_CONCURRENCY=3
```

O objetivo é antecipar poucos segmentos sem saturar o upstream.

## Limpeza

A API possui:

```http
POST /clear-cache
x-api-key: <SIGN_API_KEY>
```

Não executar em produção sem entender o impacto: `flushall` remove todo o conteúdo do Redis usado por esse serviço.

## Diagnóstico

```bash
docker compose exec redis redis-cli ping
```

Se o backend apresentar erros de autenticação/conexão, conferir primeiro:

1. URL de conexão;
2. nome do serviço (`redis` no Compose);
3. existência do container;
4. logs do Redis;
5. se uma senha foi adicionada sem refletir na URL.
