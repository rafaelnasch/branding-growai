---
name: branding-growai
description: A identidade visual GrowAI — relatórios, PDFs, decks, one-pagers e dashboards no padrão "Liquid Glass" v6 - Satoshi + Inter, fundo frio #F1F4F8, laranja #FF6A1A, cards de vidro fosco com glow ambiente, lockup GrowAI e Mobile System v1. Use para qualquer material interno, de consultoria ou de marca GrowAI. Triggers - "/branding-growai", "branding growai", "id visual growai", "identidade growai", "padrão growai", "growai style", "material growai", "pdf growai", "relatório growai", "faz no padrão growai".
---

# /branding-growai — A Identidade Visual GrowAI

Um estilo de casa travado: documento premium, frio e tranquilo, com **cards de vidro fosco (Liquid Glass)**, glow laranja ambiente e tipografia Satoshi + Inter. Tudo abaixo vale para **todo** material GrowAI — relatório, PDF, one-pager, dashboard, deck. Este arquivo é o estilo inteiro: paleta, tipografia, a técnica Liquid Glass, componentes, mobile e export de PDF.

**Brand book (abra PRIMEIRO):** [`brand-book.html`](brand-book.html) nesta pasta — o estilo documentando a si mesmo: cores, escala tipográfica com pesos travados, princípios do Liquid Glass, todos os componentes canônicos ao vivo, regras de layout e a receita de PDF. Ele é construído 100% no padrão GrowAI e o `<head>` + `<style>` dele são o **template portátil**: quando for construir algo, copie a `<style>` completa (e os dois `<script>` do fim do body) e adapte só o conteúdo. Quando estiver como ele parece, está certo.

---

## Cores (TRAVADAS)

| Papel | Valor | Uso |
|---|---|---|
| Fundo principal | `#F1F4F8` (frio) | fundo padrão de todo documento |
| Superfícies | `#FFFFFF` · `#F6F8FA` (soft) | superfícies sólidas quando o glass não cabe |
| Tinta (títulos) | `#0C0F14` | headings, palavras fortes, valores de tabela em negrito |
| Tinta 2 (corpo) | `#3A4150` | parágrafos e células |
| Muted / Faint | `#5B6472` · `#8A93A3` | texto secundário · overlines e rótulos |
| Linhas | `#E7EAF0` · `#EEF1F5` | divisores, bordas de tabela |
| **Laranja GrowAI** | `#FF6A1A` | O accent. Gradiente da marca: `#FF9A3D → #FF6A1A → #E63C0A` |
| Laranja de apoio | `#C8470C` (deep) · `#B33E0A` (texto laranja legível) · `#FFF1E8` (fundo soft) | rótulos de callout, links, blockquote |
| Semânticas | verde `#0E9F6E`/`#E9F8F1` · vermelho `#C0392B`/`#FBEAE8` · âmbar `#B7791F`/`#FBF4E6` | opportunity · danger · atenção |
| Dark | `#0C0F14` | SÓ em winner / feature cards, sempre com glow laranja interno |
| Glass | `rgba(255,255,255,.66)` + borda `rgba(255,255,255,.78)` | fundo dos cards frosted |

Nenhuma outra cor. **PROIBIDO azul/violeta** (`#2D5BFF`, `#7C5CFF` — paleta Aura legada; o validador do repo rejeita).

**Disciplina do laranja:** laranja marca O destaque — o que o documento está mandando você olhar (o winner, o número-chave, a recomendação). Texto laranja usa `#B33E0A` (accent-ink, contraste legível), nunca `#FF6A1A` puro em corpo. Glow é sutil e ambiente, nunca um bloco chapado. Se nada no documento precisa de destaque, nada fica laranja além do lockup.

## Tipografia (TRAVADA)

| Fonte | Papel | Regras |
|---|---|---|
| **Satoshi** (Fontshare) | Display: títulos, stats gigantes, nomes de mecanismo | Títulos **600** (700 só no winner-name e stats; 900 disponível mas raro). Letter-spacing negativo: `-0.04em` no page-title, `-0.02/-0.03em` nos menores |
| **Inter** (Google Fonts) | Corpo, tabelas, rótulos | Corpo **400**, negrito de ênfase **600** (nunca 700 em corpo). Base 16px, line-height 1.62 |
| **Mono** (`SF Mono / JetBrains Mono / Fira Code / Consolas`) | VOC (quotes literais), código, ascii-map, hex de cor | Nunca em heading |

**Padrão overline (assinatura da casa):** 10.5–12px, `uppercase`, `letter-spacing: 0.08–0.13em`, weight 600, cor faint (ou accent-deep em callout). É o rótulo de TODA seção, card e metadado.

Bloco de import (copie sempre os dois):
```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Lockup GrowAI (TRAVADO)

Todo material abre com este bloco, copiado LITERALMENTE (o validador do repo compara caractere a caractere):

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

Título do documento, `aria-label` e rodapé usam **GrowAI**. Nunca logo Aura, nunca texto solto "AURA", nunca outra marca.

## Visual — Liquid Glass (A técnica da casa)

Onde a ROBO tem dot-matrix, a GrowAI tem **vidro fosco sobre glow**. Quatro camadas, sempre nesta ordem:

1. **Glow ambiente** — o fundo `#F1F4F8` recebe 2–3 radial-gradients laranja fixos, MUITO sutis (alpha .05–.13), via `body::before` com `position:fixed; z-index:-2`. É o que dá profundidade e faz o vidro "refratar":
```css
body::before { content:""; position:fixed; inset:0; z-index:-2; pointer-events:none;
  background:
    radial-gradient(48% 38% at 82% -4%, rgba(255,106,26,.13), transparent 72%),
    radial-gradient(42% 40% at 8% 102%, rgba(255,154,61,.11), transparent 72%),
    radial-gradient(38% 34% at 60% 48%, rgba(230,60,10,.05), transparent 70%); }
```
2. **Cards de vidro** — todo card informativo é frosted: `background:rgba(255,255,255,.66); backdrop-filter:blur(20px) saturate(155%); border:1px solid rgba(255,255,255,.78);` + sombra em duas camadas (`0 1px 2px` de contato + `0 8–18px 22–50px` de ambiente, sempre `rgba(12,15,20,…)`). Radius `18px` (cards) e `12px` (elementos menores).
3. **Glow de destaque** — o winner (card dark) carrega um halo laranja interno: pseudo-elemento com `radial-gradient(circle, rgba(255,106,26,.42), transparent 62%)` + `filter:blur(40px)`. Stats gigantes ganham `text-shadow: 0 2px 24px rgba(255,106,26,.16)`.
4. **Movimento discreto** — reveal no scroll (fade + 20px de subida), count-up nos números (`data-count`/`data-suffix`), hover-lift de 3px nos cards. Tudo progressive enhancement: **visível sem JS**, com failsafe de ~2.6s que revela tudo se o IntersectionObserver não disparar, e `prefers-reduced-motion` respeitado. O script canônico está no fim do `brand-book.html` — copie inteiro, nunca reescreva.

**Fallbacks travados (é aqui que quebra se ignorar):**
- `@supports not (backdrop-filter…)` → cards viram sólido `linear-gradient(180deg,#FFFFFF,#FBFCFE)`; tintados (callout/opportunity/danger) viram a versão opaca da mesma família de cor. Nunca película translúcida sem blur.
- `@media (max-width:860px)` → **backdrop-filter desligado à força** (glitch/jank do blur no Safari iOS, cobre iPad portrait) + mesmos fundos sólidos.
- `@media (hover:none), (pointer:coarse)` → sem hover-lift, sem sticky-hover.

## Componentes canônicos

Os nomes de classe são API — skills e o validador dependem deles. Nunca renomeie.

| Classe | Uso |
|---|---|
| `meta-bar` | grid de metadados no topo (Produto / Mercado / Data / Alimenta) |
| `toc` | sumário numerado com hover laranja |
| `section-label` (+ `.num`) | overline de seção com número laranja e linha degradê |
| `note` | contexto informacional neutro |
| `callout` | recomendação estratégica (tinta laranja soft) |
| `opportunity` | lacuna/oportunidade (verde soft) |
| `danger` | erro crítico a evitar (vermelho soft) |
| `quote` + `quote-source` | VOC literal em mono, borda laranja à esquerda |
| `pill pill-win/-wait/-bof/-tof` | badges de status (verde / âmbar / vermelho / laranja) |
| `kpi-grid` > `kpi-card` > `big-num` + `big-num-label` | painel de stats gigantes com divisores (número ANTES do rótulo, `data-count` pro count-up) |
| `winner` | veredito/mecanismo vencedor — card dark com glow laranja |
| `table-wrap` > `table` | TODA tabela vive dentro de `table-wrap` (rolagem no desktop, vira cards no mobile) |
| `faq` | pergunta/objeção + resposta |
| `tier-card` (+ `.popular`) | tier de oferta com preço; `.popular` ganha borda laranja e tag |
| `headline-card` (+ `.top`) | opção de headline; `.top` marca a recomendada |
| `check-row` / `step` | checklist verde / passo numerado |

**Regra do rótulo (TRAVADA):** em `note`/`callout`/`opportunity`/`danger`, o **primeiro** `<strong>` filho direto vira o overline do card. Qualquer `<strong>` seguinte é ênfase inline normal — nunca quebra a frase.

Exemplo de KPI (o padrão de stats da casa):
```html
<div class="kpi-grid reveal">
  <div class="kpi-card"><div class="big-num" data-count="58" data-suffix="%">58%</div><div class="big-num-label">rótulo da métrica</div></div>
  <div class="kpi-card"><div class="big-num" data-count="34" data-suffix="%">34%</div><div class="big-num-label">rótulo da métrica</div></div>
</div>
```

## Mobile System v1 (TRAVADO)

Todo material tem que ficar legível e sem recorte entre **320 e 430 px**:

- Breakpoint canônico `@media (max-width:640px)`: meta-bar em 1 coluna; KPIs, grids e tier-cards empilham; hover e reveal desligados.
- **Tabelas viram cards no mobile** via o script `data-growai-responsive="v1"` (fim do `brand-book.html` — copie literal): tabela com cabeçalho → cards com rótulo `data-label`; tabela de 2 colunas sem cabeçalho → cards chave/valor.
- `overflow-wrap:anywhere` global; `img/video/canvas/svg` com `max-width:100%`; `-webkit-text-size-adjust:100%`.
- **PROIBIDO** `overflow-x:hidden` global pra mascarar layout quebrado.

## Layout — regras

- **Um documento, uma coluna:** container `max-width:880px` centrado. Densidade compacta (a escala do projeto de retenção) — seções a 56px, não 120px.
- **Overline antes de tudo:** toda seção abre com `section-label` numerado. Todo card tem rótulo pequeno em caps antes do conteúdo.
- **Número antes do rótulo:** em stats, o valor gigante vem primeiro, o rótulo embaixo.
- **Hierarquia por peso e cor, não por tamanho:** corpo é 15–16px sempre; o que muda é Satoshi/Inter, 400/600 e ink/muted/faint.
- **Dark é acento, não tema:** no máximo 1–2 cards dark (winner/feature) por documento.
- **Especificidade Hopkins:** "47% de redução em 14 dias" > "resultados rápidos". Número real no `big-num`, nunca número decorativo.
- Em material interno, emojis de escaneabilidade (✅ ⚠️ ❌) são OK. Em qualquer material voltado pro consumidor final, **ícones SVG inline** (Lucide/Heroicons outline, stroke 1.5–2px), nunca emoji.

## Exportar PDF

O caminho é sempre **HTML primeiro, PDF depois** (o HTML é a fonte da verdade; o PDF é uma impressão dele). Use **Playwright**, não o `--print-to-pdf` do Chrome:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1100, "height": 900})
    pg.goto("file:///caminho/relatorio.html", wait_until="networkidle")
    pg.wait_for_timeout(4000)            # tempo REAL: reveal + count-up terminam
    pg.emulate_media(media="print")
    pg.pdf(path="relatorio.pdf", format="A4", print_background=True,
           margin={"top":"14mm","bottom":"14mm","left":"12mm","right":"12mm"})
    b.close()
```

- **`print_background=True` é obrigatório** — sem ele o winner dark, os cards tintados e o glow somem, e o PDF sai em preto-e-branco chapado.
- **A espera é de tempo real (`wait_for_timeout`)**, e é isso que garante que o count-up chegou ao valor final. Antes de imprimir, confira: `pg.eval_on_selector_all(".big-num", "els => els.map(e => e.textContent)")` tem que devolver os números finais.
- Pra impressão perfeita, adicione DENTRO da `<style>` única: `@media print { .js .reveal{opacity:1!important;transform:none!important} body::before{display:none} body{padding:24px} .winner,.kpi-grid,.note,.callout,.opportunity,.danger,.faq,.tier-card,.headline-card,.quote{break-inside:avoid} }` — glow ambiente não imprime bem e nenhum card deve partir entre páginas.
- Confira o PDF gerado página a página: nenhuma tabela cortada, nenhum card partido, KPIs com o número certo.

**Por que NÃO usar `chrome --headless --print-to-pdf --virtual-time-budget`:** o relógio virtual quebra o count-up de duas formas, e as duas já aconteceram em produção. Com `--virtual-time-budget`, o primeiro `requestAnimationFrame` pode vir com timestamp ANTERIOR ao `performance.now()` inicial, o que torna o progresso negativo e imprime **`-2`** no lugar de `147`. Sem budget suficiente, a captura pega a animação no meio e imprime **`137`** no lugar de `147`. Pior: os dois casos produzem um PDF que *parece* válido. E `--disable-javascript` não salva — o headless novo do Chrome ignora esse flag.

## Decks / slides GrowAI

Quando o material é um deck (não um documento): seções `100vh` com `scroll-snap-type:y mandatory`, fundo alternando `#F1F4F8` (maioria) e dark `#0C0F14` com glow laranja (beats de ênfase). Título Satoshi `clamp(40px, 6vw, 92px)` peso 600, tracking -0.04em. Lockup GrowAI na capa e no encerramento. Cards de vidro pros conteúdos. Uma ideia por slide, título ≤ 6 palavras, uma linha de apoio no máximo. Mesmos tokens, mesmos componentes, mesma disciplina do laranja.

## Gotchas (vão te morder)

1. **Exatamente uma `<style>` por arquivo.** O gate estrutural conta pares `<style>...</style>` — adições de print/extra vão DENTRO da única style, nunca numa segunda tag.
2. **Snippets canônicos são literais.** Lockup e script responsivo são comparados caractere a caractere pelo validador — copie, não redigite.
3. **`backdrop-filter` no iOS Safari** trava/glitcha em scroll — por isso o corte ≤860px é à força com `!important`. Não "otimize" isso embora.
4. **Count-up precisa do número final no HTML** (`<div class="big-num" data-count="58" data-suffix="%">58%</div>`) — sem JS o valor já está lá. Em valores monetários grandes, **não use `data-count`**: o count-up imprime `324213.88` sem separador de milhar. Deixe o texto formatado (`R$ 324 mil` ou `R$ 324.213,88`) e reserve a animação para números limpos (147, 6.2, 4).
5. **`.reveal` sem o script = conteúdo some?** Não — a classe `.js` só entra via JS; sem JS nada fica invisível. Mantenha esse guard se mexer no script.
6. **Chrome Auto Dark Mode:** o design é light-only; se um cliente reportar cores invertidas, adicione `html { color-scheme: light; }` na style.

## Dentro do repo growaura

Se você está trabalhando dentro do repo `growaura-3` (Aura Engine), a fonte canônica NÃO é esta pasta — é o próprio repo:

- Template completo: `.claude/templates/aura-report-template.html` (nome legado, conteúdo GrowAI v6)
- Lockup: `.claude/templates/aura-logo-snippet.html` · Script responsivo: `.claude/templates/growai-responsive-script.html`
- **Gate obrigatório antes de entregar:** `python3 .claude/lib/report-html/validate.py <arquivo.html>` — zero erros.

Fora do repo, o `brand-book.html` desta pasta carrega tudo isso e serve de template portátil.

## O que este estilo NÃO é

- Não é a identidade de páginas consumidor-final — LP, VSL, aplicação e página de cliente seguem a marca da oferta/cliente, nunca este design system
- Não é azul/violeta (paleta Aura legada — banida)
- Não é dark-mode — dark é acento (winner), o documento é claro e frio
- Não é pixel/retrô — sem Doto, sem sprites, sem dot-matrix (isso é a ROBO)
- Não é parede de texto — overlines, cards e stats carregam a hierarquia
- Não é animação chamativa — movimento é discreto, progressivo e sempre opcional

---

*Skill própria da GrowAI. Anatomia (SKILL.md + brand book auto-documentado) modelada na skill "Robo Style — a drop-in design skill for Claude Code" (CC BY 4.0); todo o design system aqui é o GrowAI v6 "Retention / Liquid Glass". Criada em 29/07/2026.*
