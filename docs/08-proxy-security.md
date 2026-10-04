# 08 — Proxy e Segurança

## Componentes de segurança

O backend usa:

- Helmet;
- CORS;
- rate limit global;
- JWT para URLs assinadas;
- API key para `/sign` e `/clear-cache`;
- allowlist opcional de hosts;
- header opcional/obrigatório de player.

## SSRF

O proxy recebe URLs externas. Isso é uma superfície de risco importante.

A variável:

```env
ALLOWED_HOSTS=
```

controla a validação de host.

Com lista vazia, a implementação atual aceita hosts arbitrários. Para produção, deve ser configurada uma allowlist restritiva sempre que possível.

Evite:

```env
ALLOWED_HOSTS=*
```

em uma instalação pública.

## Assinatura

`STREAM_SECRET` protege a assinatura JWT.

Nunca usar o valor de exemplo em produção:

```env
STREAM_SECRET=change-this-secret
```

Gerar um segredo aleatório e não versioná-lo.

## API key

`SIGN_API_KEY` protege a emissão de tokens.

O frontend recebe essa chave através de `NEXT_PUBLIC_STREAM_API_KEY`, portanto ela deve ser considerada **exposta ao cliente**. Ela não deve ser tratada como um segredo de alta confiança.

A proteção real do proxy deve continuar baseada em JWT, allowlist, rate limit e controles de origem.

## Player header

O backend usa:

```env
REQUIRE_PLAYER_HEADER=true
```

por padrão.

O endpoint `/proxy` verifica `x-player-auth` quando essa opção está habilitada. `/stream` depende principalmente da validação do token.

## CORS

O código atual usa CORS aberto. Isso é conveniente durante desenvolvimento, mas deve ser restringido quando a aplicação estiver publicada.

## Rate limiting

Configurações:

```env
RATE_LIMIT_WINDOW_MS=1000
RATE_LIMIT_MAX=10
```

Há também limitação associada ao token durante o proxy.

## Checklist de produção

- [ ] `STREAM_SECRET` aleatório.
- [ ] `SIGN_API_KEY` não trivial.
- [ ] `ALLOWED_HOSTS` restritivo.
- [ ] CORS restrito ao domínio real.
- [ ] `REQUIRE_PLAYER_HEADER=true` quando compatível com o fluxo.
- [ ] rate limit revisado.
- [ ] logs sem tokens completos.
- [ ] Kuhi não publicado diretamente na internet.
- [ ] Redis não publicado diretamente na internet.
