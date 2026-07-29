# branding-growai

**A identidade visual GrowAI como skill drop-in pra Claude Code.** Relatórios, PDFs, one-pagers, dashboards e decks no padrão **GrowAI v6 "Liquid Glass"**: Satoshi nos títulos, Inter no corpo, fundo frio `#F1F4F8`, laranja `#FF6A1A`, cards de vidro fosco sobre glow ambiente e mobile garantido de 320 a 430 px.

| Desktop | Mobile (390 px) |
|---|---|
| ![Preview desktop](assets/preview-desktop.png) | ![Preview mobile](assets/preview-mobile.png) |

## O que vem dentro

- **[`SKILL.md`](SKILL.md)** — a spec travada do estilo: paleta, tipografia, lockup, a técnica Liquid Glass em 4 camadas, os componentes canônicos (`callout`, `note`, `opportunity`, `danger`, `quote`, `pill`, `winner`, `kpi-grid`…), Mobile System v1, regras de layout, export de PDF e a variante pra decks.
- **[`brand-book.html`](brand-book.html)** — o estilo documentando a si mesmo. Abra no navegador pra ver tudo ao vivo. Ele também é o **template portátil**: copie o `<head>`, a `<style>` completa e os dois `<script>` do fim do body, e adapte só o conteúdo.

## Instalação

Skill global (vale pra qualquer projeto):

```bash
git clone https://github.com/rafaelnasch/branding-growai.git ~/.claude/skills/branding-growai
```

Ou por projeto:

```bash
git clone https://github.com/rafaelnasch/branding-growai.git .claude/skills/branding-growai
```

## Uso

No Claude Code, peça qualquer material citando o estilo:

- `/branding-growai` · "faz no padrão growai" · "id visual growai"
- "gera um one-pager dessa proposta no padrão growai"
- "transforma esse relatório em PDF com a identidade growai"

A skill instrui o Claude a abrir o brand book primeiro e construir o material com os tokens, componentes e gates do padrão (incluindo o teste mobile 320–430 px e a receita de PDF via Chrome headless).

## O padrão em 30 segundos

- **Cores:** fundo frio `#F1F4F8`, tinta `#0C0F14`, um único accent laranja `#FF6A1A` (gradiente da marca `#FF9A3D → #FF6A1A → #E63C0A`; texto laranja legível em `#B33E0A`). Verde/vermelho/âmbar só como semânticas de componente. Azul e violeta são banidos.
- **Tipografia:** Satoshi (display, 600/700, tracking negativo) + Inter (corpo, 400/600) + mono pra VOC e código. Overlines em caps são a assinatura da casa.
- **Liquid Glass:** glow laranja ambiente no fundo → cards `rgba(255,255,255,.66)` com `backdrop-filter: blur(20px)` → glow de destaque no winner → movimento discreto (reveal, count-up, hover-lift), tudo progressive enhancement com fallbacks travados.
- **Mobile System v1:** breakpoint 640px, tabelas viram cards rotulados via script, nada sai da viewport entre 320 e 430 px.

## Adaptando pra sua marca

O CC BY 4.0 cobre o texto, o código e a documentação do design system — não o nome nem o logo GrowAI. Se for adaptar pro seu contexto, troque o lockup, o wordmark e os tokens de cor pelos da sua marca (o `SKILL.md` mostra exatamente onde cada um vive).

## Licença

[CC BY 4.0](LICENSE). Anatomia da skill (spec + brand book auto-documentado) modelada na skill "Robo Style — a drop-in design skill for Claude Code" (CC BY 4.0); o design system GrowAI v6 "Liquid Glass" é trabalho original da GrowAI.
