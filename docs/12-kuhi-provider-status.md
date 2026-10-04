# 12 — Status dos Providers do Kuhi

## Fonte do status

O Kuhi expõe:

```http
GET /anime/providers/status
```

O Best-Animes replica essa informação por:

```http
GET /api/anime/providers/status
```

A implementação deve ser tratada como dinâmica: o Kuhi mede disponibilidade/latência e pode mudar o provider vencedor. citeturn0search0

## Providers nativos documentados pelo Kuhi

A documentação atual do Kuhi lista dez providers nativos:

```text
anineko
anizone
anikoto
reanime
aniwaves
kaa
anibd
animegg
mkissa
animeonsen
```

A lista e a disponibilidade podem mudar no upstream. citeturn0search0

## Interpretação

`defaultProvider` não significa que o provider será sempre o vencedor. O Kuhi pode executar uma corrida e devolver outro provider se ele responder primeiro. citeturn0search0

## Diagnóstico

Se todos os providers estiverem indisponíveis:

1. confirme que Kuhi está saudável;
2. consulte `/api/anime/providers/status`;
3. teste `/anime/episodes/<id>` diretamente dentro da rede Docker;
4. teste `/anime/extract/<id>?e=1&type=sub`;
5. verifique logs do Kuhi.

## Não codificar provider vencedor

O Best-Animes não deve assumir:

```js
provider === 'anineko'
```

como regra permanente. A aplicação deve consumir o resultado retornado pelo Kuhi.
