# Documentação do Best-Animes

Esta pasta contém a documentação atual do Best-Animes.

## Ordem recomendada de leitura

1. `01-architecture.md` — visão geral e responsabilidades.
2. `02-provider-system.md` — contrato de provider e `KuhiProvider`.
3. `03-kuhi-integration.md` — integração HTTP com o Kuhi.
4. `04-api-routes.md` — API pública do backend do Best-Animes.
5. `05-streaming-flow.md` — fluxo de reprodução, assinatura e proxy.
6. `06-docker.md` — arquitetura Docker e comandos.
7. `07-redis.md` — cache e pré-carregamento de segmentos.
8. `08-proxy-security.md` — segurança, SSRF, tokens e configuração.
9. `09-testing.md` — estratégia de validação.
10. `10-troubleshooting.md` — diagnóstico de problemas.
11. `11-codex-guide.md` — regras para trabalhar com Codex/IA sem quebrar a arquitetura.
12. `12-kuhi-provider-status.md` — interpretação do status dos providers do Kuhi.
13. `13-roadmap.md` — próximos passos.

## Regra principal

O frontend nunca deve conversar diretamente com o Kuhi. O fluxo oficial é:

```text
Browser
  ↓
Next.js
  ↓ /api/*, /sign, /stream
Express Backend
  ↓
KuhiProvider
  ↓ HTTP
Kuhi
  ↓
Providers nativos
```
