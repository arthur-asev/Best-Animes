# 10 — Troubleshooting

## Frontend abre, mas chamadas `/api` falham

Verifique:

```bash
docker compose ps
```

Depois:

```bash
curl http://localhost:5000/health
```

Se o backend estiver saudável, confira `BACKEND_URL` no container frontend.

## Backend retorna 502 nas rotas de anime

Provavelmente o Kuhi não respondeu corretamente.

```bash
docker compose logs -f kuhi
```

E:

```bash
docker compose exec backend node -e "fetch('http://kuhi:8000/docs').then(r=>console.log(r.status)).catch(console.error)"
```

## Kuhi não inicia

Verifique:

```bash
docker compose logs kuhi
```

Problemas comuns:

- clone do GitHub falhou;
- branch/tag inexistente;
- dependência Python falhou;
- upstream alterou sua estrutura.

## Busca funciona, mas episódio não reproduz

Verifique:

```bash
curl "http://localhost:5000/api/anime/watch/kuhi:21:1:sub"
```

Se houver stream, confirme o `referer`.

Depois observe `/sign` e `/stream` no navegador.

## `/sign` retorna 403

Confira:

```env
SIGN_API_KEY=...
NEXT_PUBLIC_STREAM_API_KEY=...
```

O valor usado pelo frontend precisa corresponder ao valor esperado pelo backend.

## `/stream` retorna 403

Causas comuns:

- token expirado;
- assinatura inválida;
- URL não permitida;
- configuração de host inadequada.

## Stream carrega e para

Investigue:

1. validade do token;
2. referer;
3. URLs dos segmentos;
4. resposta do CDN;
5. cache Redis;
6. rate limit;
7. qualidade/codec retornado pelo Kuhi.

## Redis falha

```bash
docker compose exec redis redis-cli ping
```

Se retornar `PONG`, valide a variável:

```env
SERVER_API_REDIS_CONN_URL=redis://redis:6379
```

## Alteração no Kuhi não aparece

Se a imagem foi construída anteriormente:

```bash
docker compose build --no-cache kuhi
docker compose up -d kuhi
```

## VPN/proxy do sistema

Se funcionar fora de uma VPN e falhar dentro dela, compare:

- acesso ao GitHub;
- DNS;
- conexão entre containers;
- acesso do backend ao Kuhi;
- acesso do backend aos CDNs.

Não atribua automaticamente o problema ao Docker antes de testar a conectividade dentro dos containers.
