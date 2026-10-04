# 06 — Docker

## Serviços

O `docker-compose.yml` define quatro serviços:

```text
frontend :3000
backend  :5000
kuhi     :8000 (expose interno)
redis    :6379 (rede interna)
```

Fluxo:

```text
Browser → frontend → backend → kuhi
                         ↓
                       redis
```

O Kuhi não precisa publicar `8000` no host. O backend acessa `http://kuhi:8000` pela rede Docker.

## Inicialização

```bash
docker compose up -d --build
```

Verificar:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs -f backend
docker compose logs -f kuhi
docker compose logs -f frontend
```

## Healthchecks

Backend:

```http
GET http://localhost:5000/health
```

Kuhi:

```text
http://kuhi:8000/docs
```

Redis:

```bash
docker compose exec redis redis-cli ping
```

Resposta esperada:

```text
PONG
```

## Variáveis

### Backend

```env
PORT=5000
BACKEND_URL=http://backend:5000
PROXY_HOST=http://localhost:5000
SIGN_API_KEY=change-me
STREAM_SECRET=change-this-secret
SERVER_API_REDIS_CONN_URL=redis://redis:6379
KUHI_URL=http://kuhi:8000
KUHI_TIMEOUT_MS=15000
```

### Kuhi

```env
KUHI_REPO=https://github.com/aryaniiil/anime-api.git
KUHI_REF=main
```

## Rebuild do Kuhi

Se `KUHI_REF` ou `KUHI_REPO` mudar:

```bash
docker compose build --no-cache kuhi
```

Depois:

```bash
docker compose up -d
```

## Desenvolvimento local sem Docker

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm start
```

Kuhi, conforme a documentação upstream, pode ser executado com Python/uvicorn. citeturn0search0

## Regra para commits

Não versionar:

- `.env` com secrets;
- tokens JWT;
- chaves de API reais;
- dumps do Redis;
- cache de streams.
