# Best Animes

Aplicação de catálogo e reprodução de animes. O projeto tem duas partes: o frontend em Next.js (`/`) e a API/proxy de mídia em Express (`/backend`). A API usa o provider Zoro da dependência `@consumet/extensions`.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Redis apenas se quiser habilitar o cache do proxy de mídia (opcional)

## Rodar em desenvolvimento

1. Clone o repositório e entre na pasta do projeto.

2. Instale as dependências do frontend:

   ```bash
   npm ci
   ```

3. Instale as dependências do backend:

   ```bash
   cd backend
   npm ci
   cd ..
   ```

4. Configure as variáveis de ambiente para reprodução de vídeo. Crie `backend/.env` com:

   ```dotenv
   SIGN_API_KEY=uma-chave-compartilhada-local
   STREAM_SECRET=uma-frase-secreta-longa-e-aleatoria
   ```

   Crie também `.env.local` na raiz, usando o mesmo valor de `SIGN_API_KEY`:

   ```dotenv
   NEXT_PUBLIC_STREAM_API_KEY=uma-chave-compartilhada-local
   ```

   Essas variáveis habilitam a assinatura das URLs do proxy HLS. Sem elas, a API de catálogo pode iniciar, mas o endpoint de assinatura de streams não funcionará. Redis não é necessário para iniciar; defina `SERVER_API_REDIS_CONN_URL` em `backend/.env` somente se tiver uma instância Redis disponível.

5. Em um terminal, inicie o backend:

   ```bash
   cd backend
   npm start
   ```

   A API ficará em `http://localhost:5000`.

6. Em outro terminal, na raiz do projeto, inicie o frontend:

   ```bash
   npm run dev
   ```

   Acesse `http://localhost:3000`. O frontend encaminha as rotas `/api/*` para o backend na porta `5000`.

## Rodar com Docker

Requer Docker com Docker Compose. A partir da raiz do repositório:

1. Crie a configuração local e defina chaves aleatórias. O `SIGN_API_KEY` é compartilhado pelo frontend e backend.

   ```bash
   cp .env-exemple .env
   ```

2. Construa e inicie frontend, API e Redis:

   ```bash
   docker compose up --build -d
   ```

3. Acesse `http://localhost:3000`. A API fica disponível em `http://localhost:5000/health`.

Use `docker compose logs -f` para acompanhar os logs e `docker compose down` para parar os serviços. O Redis persiste os dados no volume `redis-data`. Depois de alterar `SIGN_API_KEY`, reconstrua os serviços com `docker compose up --build -d`, pois a chave pública é incorporada ao frontend durante o build.

Ao publicar a API em outro host/domínio, defina `PROXY_HOST` no `.env` com a URL pública que o navegador deve acessar. Não publique o arquivo `.env`.

## Comandos úteis

Na raiz:

```bash
npm run dev       # inicia o frontend em desenvolvimento
npm run build     # gera a versão de produção do frontend
npm start         # inicia o frontend em modo de produção (após npm run build)
```

Em `backend/`:

```bash
npm start         # inicia API e proxy HLS na porta 5000
npm test          # executa os testes automatizados do backend
```

## Rotas principais da API

- `GET /api/anime/search?q=termo` — busca animes
- `GET /api/anime/info/:id` — detalhes de um anime
- `GET /api/anime/watch/:episodeId` — fontes e dados de reprodução
- `GET /api/anime/top-airing` — animes em exibição
- `GET /api/anime/recent-episodes` — episódios recentes
- `GET /api/anime/genres` — gêneros
- `GET /health` — verifica se o backend está ativo

As rotas `/api/manga/*` estão preparadas, mas respondem que ainda não há provider de mangá disponível.

## Observações

- A configuração do Next encaminha a API e o proxy para `BACKEND_URL`; no Compose, essa URL aponta para o serviço `backend`.
- `BACKEND_URL` pode ser configurada no ambiente do Next para páginas renderizadas no servidor. O padrão é `http://localhost:5000`.
- Não versionar arquivos `.env` nem compartilhar chaves reais.
