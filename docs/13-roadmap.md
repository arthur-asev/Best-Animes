# 13 — Roadmap

## Prioridade alta

### 1. Fixar versão do Kuhi

Trocar `KUHI_REF=main` por uma tag/commit validado para builds reproduzíveis.

### 2. Testes automatizados de contrato

Criar testes que simulem respostas do Kuhi para:

- busca;
- detalhes;
- episódios sub/dub;
- HLS;
- MP4;
- DASH;
- legendas;
- erro 404;
- timeout;
- provider indisponível.

### 3. Segurança do proxy

Implementar uma política explícita de `ALLOWED_HOSTS` para produção e revisar CORS.

### 4. Observabilidade

Adicionar logs estruturados para:

- latência Kuhi;
- endpoint chamado;
- provider retornado;
- status upstream;
- cache hit/miss;
- erros de reprodução.

Nunca registrar tokens completos ou secrets.

## Prioridade média

### 5. Fallback de provider no Best-Animes

Manter a arquitetura preparada para outro `AnimeProvider`, caso o Kuhi deixe de ser adequado.

### 6. Cache de catálogo

Adicionar cache específico para buscas, detalhes e gêneros com TTL adequado.

### 7. Suporte de formatos

Expandir o player para DASH/MP4 caso o produto realmente precise desses retornos.

### 8. Testes E2E

Automatizar:

```text
search → info → episode → watch → sign → stream
```

## Prioridade baixa

- painel administrativo;
- métricas históricas de providers;
- seleção manual de provider;
- preferências de qualidade;
- telemetria de erros do player.

## Regra do roadmap

Novas funcionalidades não devem quebrar o princípio:

```text
Frontend → Backend → Provider → Kuhi/upstream
```
