---
name: branding-growai
description: A identidade visual GrowAI — documentos, decks, PDFs, one-pagers e dashboards no padrão "Liquid Glass" v6 - Satoshi + Inter, fundo frio #F1F4F8, laranja #FF6A1A, cards de vidro sobre glow, motor de gráficos GVIZ (barras, anel, funil, ranking, linha) e lei editorial "o número lidera". Use para qualquer material interno, de consultoria ou de marca GrowAI. Triggers - "/branding-growai", "branding growai", "id visual growai", "identidade growai", "padrão growai", "growai style", "material growai", "pdf growai", "relatório growai", "deck growai", "gráfico growai", "faz no padrão growai".
---

# /branding-growai — A Identidade Visual GrowAI

Um estilo de casa travado: premium, frio e tranquilo, com **cards de vidro fosco sobre glow laranja** e **dados que viram forma, não tabela**. Tudo abaixo vale para **todo** material GrowAI. Este arquivo é o estilo inteiro: paleta, tipografia, a técnica Liquid Glass, o motor de gráficos, a lei editorial, os dois formatos (documento e deck), mobile e PDF.

**Abra PRIMEIRO:** [`brand-book.html`](brand-book.html) — o estilo documentando a si mesmo, com componentes, os sete gráficos e as seis formas ao vivo. O `<head>` + `<style>` dele são o template portátil do **documento**. Pra **deck**, o esqueleto pronto é [`deck-template.html`](deck-template.html). Os motores vivem em [`gviz.js`](gviz.js) (dados) e [`gforms.js`](gforms.js) (formas conceituais) — copie os blocos inteiros pro `<script>` de cada artefato. Quando estiver como esses arquivos parecem, está certo.

---

## Cores (TRAVADAS)

| Papel | Valor | Uso |
|---|---|---|
| Fundo principal | `#F1F4F8` (frio) | fundo padrão de todo documento |
| Superfícies | `#FFFFFF` · `#F6F8FA` | superfícies sólidas quando o glass não cabe |
| Tinta | `#0C0F14` (títulos) · `#3A4150` (corpo) | hierarquia por cor, não por tamanho |
| Muted / Faint | `#5B6472` · `#67717F` | apoio · overlines e rótulos (o faint subiu de `#8A93A3` pra `#67717F` — contraste AA ~4,5:1 nos micro-rótulos) |
| Linhas | `#E7EAF0` · `#EEF1F5` | divisores, baseline de gráfico |
| **Laranja GrowAI** | `#FF6A1A` | O accent. Gradiente da marca: `#FF9A3D → #FF6A1A → #E63C0A` |
| Laranja de apoio | `#C8470C` (deep) · `#B33E0A` (texto legível) · `#FFF1E8` (soft) | rótulos, links, valores destacados |
| Neutro de gráfico | `#C9D1DE` · `#DDE3EC` (claro) · `rgba(255,255,255,.20/.32)` (dark) | TODAS as séries sem destaque |
| Semânticas | verde `#0E9F6E` · vermelho `#C0392B` · âmbar `#B7791F` (+ fundos soft) | opportunity · danger · atenção |
| Dark | `#0C0F14` | winner, feature cards e slides de ênfase — sempre com glow laranja |
| Glass | `rgba(255,255,255,.66)` + borda `rgba(255,255,255,.78)` | cards e painéis de gráfico |

Nenhuma outra cor. **PROIBIDO azul/violeta** (`#2D5BFF`, `#7C5CFF` — paleta legada; o validador do repo rejeita).

**Disciplina do laranja:** laranja marca O destaque — a barra do mês que importa, o estágio onde o dinheiro trava, a vendedora que lidera, a recomendação. **Um destaque por gráfico, um por grupo de cards.** Texto laranja usa `#B33E0A` (nunca `#FF6A1A` puro em corpo). Se nada precisa de destaque, nada fica laranja além do lockup.

## Tipografia (TRAVADA)

| Fonte | Papel | Regras |
|---|---|---|
| **Satoshi** (Fontshare) | Display: títulos, stats, TODO número de gráfico | Títulos **600** (700 só em winner-name e stats). Tracking negativo: `-0.04em` no título de página, `-0.02/-0.03em` nos menores. Números sempre `tabular-nums` |
| **Inter** (Google Fonts) | Corpo, rótulos de gráfico, tabelas | Corpo **400**, ênfase **600** (nunca 700 em corpo). Base 16px / 1.62 |
| **Mono** | VOC literal, código, hex | Nunca em heading, nunca em número de gráfico |

**Padrão overline (assinatura da casa):** 10.5–12px, `uppercase`, `letter-spacing: 0.08–0.13em`, weight 600, cor faint. Abre TODA seção, card, painel de gráfico e metadado.

**Notação de número gigante:** nos stats, a unidade vai rebaixada (`R$ 324<span style="font-size:.45em"> mil</span>`); em headline corrida, por extenso ("R$ 607 mil"). Nunca as duas formas no MESMO componente.

Imports (copie sempre os dois):
```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Lockup GrowAI (TRAVADO)

Todo material abre com este bloco, copiado LITERALMENTE (o validador compara caractere a caractere). Em deck: capa e encerramento.

```html
<div class="logo-wrap reveal" data-brand="growai">
  <svg class="logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="GrowAI">
    <defs>
      <linearGradient id="growaiG" x1="12%" y1="6%" x2="88%" y2="96%">
        <stop offset="0%" stop-color="#FF9A3D"/>
        <stop offset="52%" stop-color="#FF6A1A"/>
        <stop offset="100%" stop-color="#E63C0A"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#growaiG)"/>
    <text x="100" y="135" text-anchor="middle" font-family="'Arial Black','Helvetica Neue',Arial,sans-serif" font-weight="900" font-size="152" fill="#FFFFFF">g</text>
  </svg>
  <span class="logo-word">GrowAI</span>
</div>
```

Título, `aria-label` e rodapé usam **GrowAI**. Nunca logo Aura, nunca outra marca.

## Liquid Glass — a técnica de superfície

Vidro fosco sobre glow. Quatro camadas, sempre nesta ordem:

1. **Glow ambiente** — `body::before` fixo com 2–3 radiais laranja MUITO sutis (alpha .05–.13). É o que dá profundidade e faz o vidro refratar.
2. **Cards de vidro** — `rgba(255,255,255,.66)` + `backdrop-filter: blur(20px) saturate(155%)` + borda `rgba(255,255,255,.78)` + sombra em duas camadas. Radius 18px / 12px.
3. **Glow de destaque** — winner (card/slide dark) com halo laranja interno desfocado; stats com `text-shadow` laranja a 16%.
4. **Movimento discreto** — reveal no scroll, count-up (`data-count`), hover-lift 3px. Progressive enhancement: visível sem JS, failsafe 2.6s, `prefers-reduced-motion` respeitado. Script canônico no fim do `brand-book.html` — copie, nunca reescreva.

**Fallbacks travados:** sem suporte a blur → sólido `linear-gradient(180deg,#FFFFFF,#FBFCFE)`; `≤860px` → blur desligado à força (`!important`, glitch do Safari iOS); touch → sem hover-lift. Não "otimize" esses cortes embora.

## GVIZ — a linguagem de dados (TRAVADA)

Onde a casa mostra número, mostra **forma**. O motor é [`gviz.js`](gviz.js) — SVG puro, zero dependências, determinístico. Copie o bloco VERBATIM pro `<script>` do artefato e chame:

| Chamada | Pra que dado | Exemplo |
|---|---|---|
| `gviz.bars(el, {labels, values, vlabels, highlight})` | comparação por período (receita mensal) | barra do pico em gradiente |
| `gviz.hbars(el, {labels, values, vlabels, highlight, labw})` | ranking (vendedora, produto, canal) | líder em gradiente |
| `gviz.ring(el, {value, vlabel, label})` | UM percentual que decide (0–100) | "65% em 7 dias" |
| `gviz.funnel(el, {stages: [{label, value, vlabel}], highlight})` | estágios de pipeline | o estágio onde trava, em laranja |
| `gviz.share(el, {segments: [{label, value, vlabel}], highlight, legw})` | composição 100% (concentração) | top 10 em gradiente |
| `gviz.line(el, {labels, values, vlabels, highlight, area})` | tendência com ponto-chave | último ponto em laranja |
| `gviz.flow(el, {steps: [{label, sub}], highlight})` | diagrama de etapas (jornada, processo) | a etapa que importa |

Regras embutidas no motor (não contorne):

- **Um destaque por gráfico.** `highlight` marca UM índice — gradiente da marca + glow. Todo o resto fica no neutro frio. Sem destaque? Passe `highlight: -1`.
- **Números em Satoshi 700 tabular, rótulos em Inter.** Formate valores você mesmo via `vlabels` (`"99,1k"`, `"R$ 2.561"`) — o motor não sabe locale.
- **Zero gridlines.** Só a baseline em hairline. O valor está escrito em cima de cada forma; grade é ruído.
- **Rótulos de funil curtos** (≤ 18 caracteres). Quando o texto não cabe na barra, o motor o tira pra fora sozinho (pro lado com mais espaço, até em duas linhas) — mas rótulo curto sempre fica melhor.
- **`dark: true`** troca a paleta neutra pros slides/cards escuros. Mesma API.
- O SVG sai com `viewBox` + `width:100%` — responsivo e vetorial no PDF de graça.

Todo gráfico vive num painel de vidro com overline:

```html
<div class="chart-panel reveal">
  <div class="chart-title">Receita por mês</div>
  <div id="cReceita"></div>
</div>
```

```css
.chart-panel { margin:24px 0; padding:26px 28px; border-radius:var(--r); background:var(--glass);
  -webkit-backdrop-filter:blur(22px) saturate(155%); backdrop-filter:blur(22px) saturate(155%);
  border:1px solid var(--glass-line); box-shadow:var(--shadow); }
.chart-title { font-size:11px; font-weight:600; color:var(--faint); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:16px; }
```

(Inclua `.chart-panel` nas listas de fallback sólido do `@supports` e do `≤860px`, junto com `.kpi-grid` — o brand book já traz pronto.)

## GFORMS — a ilustração da casa

Onde a ROBO tem o dot-matrix, a GrowAI tem **formas de pontos e gradiente**. Quando o slide precisa de uma FORMA (conceito, não dado), ela sai do motor [`gforms.js`](gforms.js) — nunca de banco de imagem, nunca de emoji. Copie o bloco verbatim junto com o gviz e chame:

| Forma | Conceito que representa |
|---|---|
| `gforms.orbe(el, {s, dark})` | núcleo, foco, o produto no centro (eco do logo) |
| `gforms.aneis(el, {s, dark})` | crescimento, expansão, alcance |
| `gforms.horizonte(el, {w, h, dark})` | começo, lançamento — A assinatura de capa e closer de todo deck |
| `gforms.campo(el, {w, h, step, dark})` | mercado, audiência, base — com a zona quente em laranja |
| `gforms.seta(el, {w, h, step, dark})` | transformação, direção, próximo passo |
| `gforms.onda(el, {w, h, step, dark})` | momentum, tendência |

Regras: **uma forma por slide**, coadjuvante do título — nunca atrás de texto corrido (o texto vence os pontos: forma fica abaixo, ao lado ou com zona oca); o foco laranja da forma É o destaque do slide, não some outro; tudo determinístico (ruído por seno, nunca `Math.random`); forma nova = função de ~20 linhas no mesmo padrão (pontos + neutro frio + UM foco em gradiente).

## Diagramas e conectores (TRAVADA)

Nunca posicione uma seta "na mão" sobre HTML com coordenadas absolutas. Três caminhos, nesta ordem de preferência:

1. Conectores e caixas no **MESMO SVG** — é o que o `gviz.flow` faz; use-o pra jornadas e processos.
2. A seta ganha a **própria célula de grid** entre as caixas (`grid-template-columns: 1fr auto 1fr`).
3. Endpoints medidos em **runtime** com `getBoundingClientRect()`.

## Lei editorial (TRAVADA)

O que fez a diferença em todo material bom da casa. Vale pra documento E deck:

1. **O número lidera.** Toda seção abre com o dado (kpi-grid, gráfico ou stat) ANTES da prosa. Texto explica o que o olho já viu.
2. **Tabela com mensagem vira gráfico.** Se a tabela existe pra dizer "X é maior", "cresceu", "concentra", "trava aqui" — ela é um gráfico mal vestido: converta com o gviz. Tabela de verdade é só pra CONSULTA (várias colunas de fatos mistos que o leitor busca linha a linha). Teste: consegue apontar a célula-mensagem? Então é gráfico.
3. **Orçamento de texto.** Documento: por seção, 1 visual + no máximo 2 parágrafos curtos (≤3 linhas cada); o que passar disso vira card (`note`/`callout`) ou morre. Deck: título ≤6 palavras, 1 linha de apoio, zero parágrafos.
4. **Uma ideia por unidade.** Uma seção = uma conclusão. Um slide = uma ideia. Se precisa de "e também", divida.
5. **Especificidade Hopkins.** "47% em 14 dias" > "resultados rápidos". Número real no visual, nunca número decorativo.
6. **Releia cortando.** Antes de entregar: cada frase sobreviveria num deck? Se não agrega decisão, corta.

## Dois formatos de primeira classe

**Documento** (`brand-book.html` é o template) — leitura individual, análise, registro: uma coluna 880px, toc, seções numeradas, gráficos + cards + tabelas de consulta, mobile 320–430px obrigatório. É o formato do relatório que a pessoa lê no celular.

**Deck** (`deck-template.html` é o esqueleto) — reunião, projeção, decisão: seções `100vh` com `scroll-snap`, maioria dos slides em `#F1F4F8` com glow sutil, 1–2 **beats escuros** (`#0C0F14` + glow laranja forte) pro achado central e pro encerramento, lockup na capa e no closer, gráfico como herói do slide (`dark:true` nos escuros), stats gigantes em Satoshi com count-up. Lei editorial no rigor máximo.

Escolha pelo uso: vai ser LIDO → documento; vai ser APRESENTADO → deck. Na dúvida com dado de venda/diagnóstico, faça o documento e destile o deck dele (mesmos gráficos, 1/4 do texto).

## Componentes canônicos

Nomes de classe são API — skills e validador dependem deles. Nunca renomeie.

| Classe | Uso |
|---|---|
| `meta-bar` | grid de metadados no topo |
| `toc` | sumário numerado com hover laranja |
| `section-label` (+ `.num`) | overline de seção com número laranja |
| `chart-panel` + `chart-title` | painel de vidro do gráfico (a moldura do gviz) |
| `kpi-grid` > `kpi-card` > `big-num` + `big-num-label` | stats gigantes com divisores (número ANTES do rótulo) |
| `note` / `callout` / `opportunity` / `danger` | contexto · recomendação · lacuna · erro crítico |
| `quote` + `quote-source` | VOC literal em mono, borda laranja |
| `pill pill-win/-wait/-bof/-tof` | badges (verde / âmbar / vermelho / laranja) |
| `winner` | veredito — card dark com glow laranja |
| `table-wrap` > `table` | tabela DE CONSULTA (rolagem no desktop, cards no mobile) |
| `faq` · `tier-card` (+`.popular`) · `headline-card` (+`.top`) · `check-row` · `step` | objeção · tier · headline · checklist · passo |

**Regra do rótulo (TRAVADA):** em `note`/`callout`/`opportunity`/`danger`, o **primeiro** `<strong>` filho direto vira o overline do card; os demais são ênfase inline normal.

**Count-up:** `<div class="big-num" data-count="58" data-suffix="%">58%</div>` — o valor final SEMPRE escrito no HTML. Em valores monetários grandes, não use `data-count` (imprime `324213.88` sem separador). Em decimais pt-BR, também não: o count-up escreve ponto (`6.2%`), nunca vírgula — escreva `6,2%` estático. Anime só inteiros limpos (147, 65, 13).

## Ícones (SVG inline, nunca emoji)

Lucide/Heroicons outline: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. Tamanhos: 16–18px em listas e trust rows, 20–24px em destaques. Cor: herda do texto via `currentColor` com `opacity:.75` em contexto neutro; accent (`#B33E0A` no claro) só no item destacado. **Seis ícones prontos pra copiar** vivem no brand book (seção 08 — alvo, tendência, check, calendário, pessoas, raio). Emojis só em relatório interno (✅ ⚠️ ❌), jamais em material apresentável.

## Mobile System v1 (TRAVADO)

Todo material legível e sem recorte entre **320 e 430 px**: breakpoint canônico `640px`; meta-bar/KPIs/grids empilham; **tabelas viram cards** via o script `data-growai-responsive="v1"` (copie literal); gráficos gviz escalam sozinhos (viewBox); `overflow-wrap:anywhere` global; mídia `max-width:100%`. **PROIBIDO** `overflow-x:hidden` global pra mascarar layout quebrado. Deck no mobile: slides empilham com altura automática.

## Exportar PDF

HTML primeiro, PDF depois. **Playwright, nunca o `--print-to-pdf` do Chrome:**

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1100, "height": 900})
    pg.goto("file:///caminho/arquivo.html", wait_until="networkidle")
    pg.wait_for_timeout(4000)            # tempo REAL: reveal + count-up terminam
    pg.emulate_media(media="print")
    pg.pdf(path="arquivo.pdf", format="A4", print_background=True,
           margin={"top":"14mm","bottom":"14mm","left":"12mm","right":"12mm"})
    b.close()
```

- **`print_background=True` é obrigatório** — sem ele o dark, os tintados e o glow somem.
- Antes de imprimir, confira os count-ups: `pg.eval_on_selector_all(".big-num", "els => els.map(e => e.textContent)")` tem que devolver os valores finais.
- **Deck:** imprima paisagem no tamanho do slide — `pg.pdf(width="1440px", height="900px", margin=0)` + CSS injetado `@media print { .slide{height:900px!important; break-after:page} .nav{display:none} html{scroll-snap-type:none} }`.
- **Gradiente de texto no print:** `background-clip:text` vaza um fio de box no PDF do Chromium — no `@media print`, texto em gradiente vira cor sólida (`#DF5406` no claro, `#FF8A3D` no dark). O `deck-template.html` já traz a regra pronta.
- No `@media print` do documento (DENTRO da única `<style>`): reveal forçado visível, `body::before` desligado, `break-inside:avoid` nos cards e no `.chart-panel`.
- Gráficos gviz são SVG → saem vetoriais, nunca serrilhados.

**Por que não o `--print-to-pdf`:** o relógio de `--virtual-time-budget` corrompe o count-up (primeiro quadro com tempo negativo imprime `-2` no lugar de `147`; budget curto congela em `137`) e `--disable-javascript` é ignorado pelo headless novo. Os dois erros geram PDF que *parece* válido.

## Gotchas (vão te morder)

1. **Exatamente uma `<style>` por arquivo.** Adições de print/chart-panel vão DENTRO dela, nunca numa segunda tag.
2. **Snippets canônicos são literais.** Lockup e script responsivo são comparados caractere a caractere.
3. **CSS var em SVG só via `style=""`.** `fill="var(--ink)"` como atributo não resolve; o gviz já faz certo — mantenha o padrão se estender.
4. **IDs de gradiente colidem** se você criar SVG na mão com `id="g"` repetido — o gviz numera sozinho (`gv1`, `gv2`…); charts manuais precisam de id único por instância.
5. **`backdrop-filter` no iOS Safari** trava em scroll — o corte ≤860px é à força, não remova.
6. **`.reveal` sem script não some nada** — a classe `.js` só entra via JS. Mantenha esse guard.
7. **Chrome Auto Dark Mode:** design é light-only; se inverter, adicione `html { color-scheme: light; }`.

## Dentro do repo growaura

Trabalhando no repo `growaura-3` (Aura Engine), a fonte canônica é o repo:

- Template: `.claude/templates/aura-report-template.html` · Lockup: `aura-logo-snippet.html` · Responsivo: `growai-responsive-script.html`
- **Gate obrigatório:** `python3 .claude/lib/report-html/validate.py <arquivo.html>` — zero erros. O gviz e o `.chart-panel` são aditivos e passam no gate.

Fora do repo, o `brand-book.html` desta pasta carrega tudo e serve de template portátil.

## O que este estilo NÃO é

- Não é a identidade de páginas consumidor-final — LP/VSL/página de cliente seguem a marca da oferta
- Não é azul/violeta, não é dark-mode (dark é acento), não é pixel/retrô (isso é a ROBO)
- **Não é tabela por padrão** — dado com mensagem vira gráfico; tabela é exceção de consulta
- Não é parede de texto — o número lidera, a prosa segue
- Não é animação chamativa — movimento discreto, progressivo, sempre opcional
- Não é multi-destaque — um laranja por gráfico, um hot-card por grupo, um foco por forma
- Não é banco de imagem — forma conceitual sai do gforms, ícone sai do spec Lucide

---

*Skill própria da GrowAI. Anatomia (spec travada + brand book auto-documentado + motores visuais próprios + lei editorial) modelada na skill "Robo Style — a drop-in design skill for Claude Code" (CC BY 4.0); o design system GrowAI v6 "Liquid Glass" e os motores GVIZ/GFORMS são trabalho original da GrowAI. Criada em 29/07/2026 · v2 (GVIZ + lei editorial + deck) e v2.1 (GFORMS + flow + ícones + faint AA `#67717F`) no mesmo dia.*
