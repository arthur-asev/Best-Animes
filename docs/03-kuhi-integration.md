# 03 — Integração com Kuhi

## Papel do Kuhi

O Kuhi fornece uma API REST para descoberta de anime, episódios e extração de streams. A documentação atual do projeto Kuhi descreve uma estratégia de corrida entre providers nativos, em que a extração pode retornar o provider vencedor, streams e legendas. O projeto também oferece endpoints de proxy HLS. citeturn0search0turn0search1

O Kuhi é tratado aqui como **dependência externa/serviço interno**, não como parte da regra de negócio do frontend.

## Endpoints Kuhi consumidos

### Busca

```http
GET /anime/search?query=<term>&page=<page>&per_page=20
```

### Informações

```http
GET /anime/info/<anilistId>
```

### Episódios

```http
GET /anime/episodes/<anilistId>
```

### Extração

```http
GET /anime/extract/<anilistId>?e=<episode>&type=sub|dub
```

### Providers

```http
GET /anime/providers/status
```

O Kuhi documenta também endpoints de descoberta e proxy próprios; o Best-Animes mantém seu próprio proxy para controlar a reprodução no frontend. citeturn0search0

## Estratégia de extração

O Best-Animes não escolhe diretamente um provider nativo do Kuhi. Ele solicita a extração ao endpoint `/anime/extract` e recebe o resultado normalizado pelo Kuhi.

Isso mantém no Kuhi a responsabilidade de:

- descobrir fontes;
- executar a corrida entre providers;
- lidar com extração/descriptografia;
- informar o provider vencedor;
- devolver streams e legendas.

## Timeouts

O timeout do cliente HTTP é configurado por:

```env
KUHI_TIMEOUT_MS=15000
```

Em caso de erro do provider, o controller converte falhas externas para HTTP 502.

## Dependência experimental

O próprio Kuhi declara que é experimental e não garante disponibilidade ou precisão. Portanto, a aplicação deve tratar falhas de extração como comportamento esperado, e não como exceção impossível. citeturn0search0

## Atualização do Kuhi

A imagem Docker atual clona o repositório configurado por:

```env
KUHI_REPO=https://github.com/aryaniiil/anime-api.git
KUHI_REF=main
```

Para reproduzir uma versão específica, prefira fixar `KUHI_REF` em uma tag ou commit validado em vez de depender permanentemente de `main`.
