# Revisão de licenças — auditoria

Leitura de metadados e notices locais, não parecer jurídico. Nenhum código Consumet foi copiado.

## Evidências

| Artefato | Evidência local | Resultado da auditoria |
|---|---|---|
| `api.consumet.org/LICENSE` | Texto integral GNU GPL versão 3 | O checkout da API carrega notice GPL-3 |
| `api.consumet.org/package.json` e lock | Campo `license: MIT` | Diverge do arquivo LICENSE do checkout |
| `node_modules/@consumet/extensions/package.json` | versão 1.8.1, `license: MIT` | Metadado do pacote da extensão é MIT |
| `node_modules/@consumet/extensions/LICENSE` | Texto integral GPL-3 | Diverge do campo license do mesmo pacote |
| Best-Animes raiz | `LICENSE` MIT e `package.json` com `license: MIT` | Licença MIT declarada para o projeto |
| Best-Animes backend | `package.json` com `license: MIT` | Metadado alinhado à licença MIT da raiz |

A listagem atual do repositório Consumet no GitHub o classifica como GPL-3.0; a página npm da extensão também informa “Licensed under GPL-3.0”. O diretório UNPKG para 1.8.1 confirma que o pacote contém um arquivo `LICENSE`, enquanto a inspeção local revela seu conteúdo GPL-3. Fontes: [organização/repositório Consumet](https://github.com/consumet) e [pacote @consumet/extensions](https://www.npmjs.com/package/@consumet/extensions).

## Decisão do proprietário do projeto

Em 2026-10-03, o proprietário solicitou explicitamente que esta integração utilize a licença MIT. O Best-Animes segue MIT em seu `LICENSE`, e o backend depende de `@consumet/extensions@1.8.1`, cujo campo `license` do `package.json` declara MIT. A implementação Zoro não foi copiada: ela é consumida pelo adaptador a partir do pacote.

O arquivo `LICENSE` distribuído dentro de `@consumet/extensions@1.8.1` contém GPL-3, divergindo do metadado MIT. Essa divergência fica registrada e o arquivo de licença/notices do pacote não foi alterado nem removido. A decisão do proprietário é aplicada operacionalmente pelo projeto; este registro não é uma conclusão jurídica sobre qual artefato rege a distribuição do pacote.

Licença de código também não determina termos de uso dos sites e mídia acessados pelos scrapers.

## Estado da integração

- Adaptador próprio `ZoroProvider` usa `ANIME.Zoro` para search, info e watch.
- Os metadados do pacote usados na escolha: versão `1.8.1`, campo `license: MIT`; o pacote mantém seu arquivo upstream `LICENSE` sem modificação.
- `npm install` adicionou 28 pacotes e reportou 11 vulnerabilidades na árvore instalada (3 moderadas, 8 altas); revisar a árvore antes de publicar.
