# Best-Animes + Kuhi — Docker

Este projeto já está preparado para subir **frontend + backend + Kuhi + Redis** pelo mesmo `docker compose`.

## 1. Pré-requisitos

- Docker Desktop/Engine com `docker compose`.
- GitHub acessível durante o build da imagem Kuhi.

O serviço `kuhi` baixa o repositório oficial no momento do build. O backend não precisa instalar Python nem clonar Kuhi manualmente.

## 2. Subir

Na raiz do projeto:

```powershell
docker compose build kuhi
docker compose up -d
```

Ou:

```powershell
.\scripts\start-kuhi.ps1
```

## 3. Verificar

```powershell
docker compose ps
docker compose logs kuhi --tail=100
docker compose logs backend --tail=100
```

Depois:

```powershell
curl http://localhost:5000/health
curl http://localhost:5000/api/anime/providers/status
curl "http://localhost:5000/api/anime/search?q=naruto"
```

Frontend:

```text
http://localhost:3000
```

## 4. Arquitetura

```text
Browser
   |
   v
Next.js :3000
   |
   v
Express :5000 --------> Redis :6379
   |
   v
Kuhi :8000
   |
   +--> native providers
```

A porta 8000 do Kuhi **não é publicada no host**. O backend acessa `http://kuhi:8000` pela rede interna do Compose.

## 5. Se o build do Kuhi falhar

O erro mais provável é acesso à rede/GitHub durante o build. Veja:

```powershell
docker compose build --no-cache kuhi
```

Se aparecer erro de DNS, proxy, VPN ou `Could not resolve host`, o problema é a conectividade do Docker com o GitHub, não o `package.json` do Best-Animes.

## 6. Dependências removidas

O backend não depende mais de `@consumet/extensions`. O `backend/package-lock.json` também foi atualizado.

## 7. IDs de episódio

O frontend não recebe IDs internos do Kuhi diretamente. O backend cria IDs estáveis no formato:

```text
kuhi:<anilistId>:<episode>:<sub|dub>
```

Exemplo:

```text
kuhi:21:1:sub
```

Isso permite trocar o provider no futuro sem acoplar o frontend ao formato interno do Kuhi.
