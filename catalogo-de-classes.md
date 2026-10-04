<!-- Gerado por build_v4.py a partir do catálogo da casca. Não edite aqui. -->
# Catálogo da casca v4 · Brand book GrowAI

Referência para quem escreve um capítulo. A página viva com tudo funcionando é `parts/_vitrine.html` (rode `python3 preview.py parts/_vitrine.html` e abra `preview/vitrine.html`). Decisões de marca: `_build/SPEC-v4.md` (vence) e `_build/SPEC.md`.

## Regras para autores de capítulo (obrigatórias)

1. **Um arquivo por capítulo:** `parts/NN-slug.html` (ex.: `parts/18-fotografia.html`). Só fragmentos: nada de `<html>`, `<head>`, `<body>`, barra ou rodapé.
2. **Seções:** cada capítulo tem uma ou mais `<section class="sec campo-…" data-titulo="NN · Título">`. A PRIMEIRA recebe `id="cap-NN"` (é o alvo do sumário); as outras, `id="cap-NN-algo"`. O `data-titulo` alimenta a barra superior (capítulo atual e contador `NN / 44`).
3. **A primeira seção é uma abertura** (`.abertura`, ver abaixo). Aberturas de PARTE (I a VIII) são geradas pelo montador antes dos capítulos 01, 06, 12, 22, 26, 30, 36 e 41: não escreva.
4. **CSS próprio** vai num `<style>` no topo do fragmento, com TODO seletor prefixado por `#cap-NN` (ou `#cap-NN-algo`). Nunca estilize `body`, `h2`, `.btn` etc. sem prefixo; nunca redefina tokens em `:root`; nunca `overflow-x:hidden` global.
5. **Nada de lorem ipsum.** Texto real em pt-BR, frases curtas, no máximo 2 travessões numa seção longa e nenhum em título. Número de exemplo leva a palavra "exemplo" (ou a classe `.exemplo`). Única prova com cliente liberada: "num e-commerce de embalagens, a fatia de oportunidades que vira venda passou de 4,7% para 10,3% em oito meses".
6. **Caminhos relativos à raiz do pacote:** `assets/...`, `gviz.js`, `gforms.js`. O preview reescreve sozinho.
7. **Itálico do foco:** em título, o trecho que importa vai em `<em>` (Newsreader Italic). O laranja dele é raro: aberturas de capítulo, faixas de foto e peças. No miolo (cabeçalho de seção, bloco, frase) a casca já põe o itálico na cor do título. Um laranja de foco por composição (ponto, barra ou itálico); o botão é o único que convive com ele, e com botão o itálico fica na cor do texto (a casca faz isso sozinha em `.tela` com `.btn`, `.btn-u` ou radar).
8. **Fotografia:** uma foto por abertura de capítulo, nunca repetida em outra abertura; fora dos capítulos 18 e 44, cada foto entra no máximo 3 vezes no livro. Prova de cliente nunca ao lado de rosto de banco. Foto marcada fora do banco em `creditos.json` não entra (os arquivos ficam em `_build/fotos-retiradas/`). O montador acrescenta `srcset` (versões de `assets/fotos/web/`), `width`/`height` e `loading="lazy"`; em miniatura, ponha `sizes="200px"`.
9. **Ritmo:** alterne campos (noite para impacto e radar, dia para leitura). Não repita grade de cartões iguais: use fio, espaço, foto grande, número grande.
10. **Teste antes de entregar:** `python3 preview.py parts/NN-slug.html`, depois `fullshot.py` em 1440 e 390 e `wide.py` (nada pode passar de 390 px). Página acima de ~16.000 px: capture por seção com `elshot.py`.

## Ferramentas

| Arquivo | Uso |
|---|---|
| `shell.css` | sistema inteiro (tokens, campos, layout, componentes, molduras, barra, capa, rodapé, impressão) |
| `shell-top.html` | head (fontes, og, favicon) + `{{CSS}}` + barra superior + `<main>` |
| `shell-bottom.html` | `</main>` + rodapé noite + `gviz.js`, `gforms.js` + script da barra, copiar e revelação |
| `partes.py` | as 8 partes e os 44 capítulos (fonte do sumário e das aberturas de parte) |
| `preview.py parts/X.html [...] [--nome n]` | gera `preview/<nome>.html` com caminhos `../../../` |
| `build_v4.py [--saida arq.html]` | monta o livro inteiro (padrão: `../../brand-book.html`); avisa ids repetidos e capítulos faltando |

## Tokens (variáveis CSS)

- **Casa:** `--foco #FF6A1A` · `--foco-txt #B33E0A` (texto laranja no dia) · `--foco-noite #FF8A4C` (texto laranja na noite) · `--foco-btn-txt #170A02` · `--g-ini #FE9426` → `--g-fim #FF1A05` (degradê do "g", `--g-degrade`).
- **Noite:** `--noite #0B0D12` · `--noite-2 #141821` · `--noite-3 #1B2130` · `--noite-linha #232936` · `--noite-txt #EEF1F5` · `--noite-corpo #CBD2DC` · `--noite-apoio #9AA3B2`.
- **Dia:** `--dia #FFF` · `--dia-2 #F6F7F8` · `--dia-3 #EEF0F3` · `--dia-linha #E4E7EB` · `--dia-txt #0C0F14` · `--dia-corpo #272D36` · `--dia-apoio #4A525E`.
- **Linhas:** `--edu/--edu-txt/--edu-bg/--edu-noite` (Framboesa), `--str…` (Cobalto), `--age…` (Verde Pulso).
- **Semânticas (sempre com rótulo):** `--bom`, `--atencao`, `--critico` (+ `-noite`).
- **Famílias:** `--ff-display` Newsreader · `--ff-texto` Hanken Grotesk · `--ff-mono` IBM Plex Mono (apelidos v3: `--titulo`, `--texto`, `--num`).
- **Escala:** `--t-mega` (número de abertura, 140–380) · `--t-hero` (46–124) · `--t-d1` (42–104) · `--t-d2` (34–68) · `--t-d3` (26–42) · `--t-h4` (21–26) · `--t-h5` 19 · `--t-lead` (19–23) · `--t-corpo` 18/17 · `--t-peq` 15,5 · `--t-micro` 13,5 · `--t-rot` 11,5.
- **Espaço:** `--e-1` 4 … `--e-11` 192 (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192) · `--pad-sec` (80–168) · `--respiro-bloco` (56–104).
- **Grade:** `--largura` 1240 · `--largura-larga` 1480 · `--largura-texto` 720 · `--margem` 16–72 · `--calha` 16–32.
- **Raios:** `--r-1` 4 · `--r-2` 8 · `--r-3` 12 · `--r-4` 16 · `--r-5` 24 · `--r-pilula`.
- **Sombras:** `--sombra-1/2/3`, `--sombra-papel` (impressos). Use `var(--f-sombra)` e `var(--f-sombra-3)`: na noite viram fio.
- **Movimento:** `--curva-foco cubic-bezier(.22,1,.36,1)` · `--curva-entrada (.16,1,.3,1)` · `--curva-saida (.7,0,.84,0)` · `--curva-padrao (.4,0,.2,1)` · `--d-rapida 160ms` · `--d-media 320ms` · `--d-lenta 640ms` · `--d-radar 6s`.

## Campos

`.campo-noite`, `.campo-dia`, `.campo-dia-2` definem `--f-fundo, --f-sup, --f-sup2, --f-linha, --f-linha-2, --f-titulo, --f-texto, --f-apoio, --f-foco, --f-foco-titulo, --f-foco-suave, --f-edu, --f-str, --f-age, --f-bom, --f-atencao, --f-critico, --f-sombra, --f-sombra-3`. Todo componente lê `--f-*`; trocar a classe do pai troca tudo. Pode aninhar (um painel noite dentro de uma seção dia).

## Tipografia base

- `h1–h4`: Newsreader 500 (`font-optical-sizing:auto`). Display grande: classe `.display` (400, −0,02em).
- `h1/h2/h3 em`, `.display em`, `.frase em` → itálico laranja `--f-foco-titulo` (`#FF6A1A` na noite, `#D9530C` no dia). `h4 em`, `h5 em`, `.foco-peq em` → `--f-foco` (no dia `#B33E0A`, para texto abaixo de 24 px). No miolo das seções o itálico fica na cor do título (ver regra 7).
- `.vg`: vírgula decimal em número grande de Plex Mono (`10<span class="vg">,</span>3%`); a casca aplica sozinha acima de 28 px.
- `.rot` rótulo mono caixa alta (`.rot.ponto` com ponto laranja, `.rot .n` trecho laranja) · `.lead` · `.apoio` · `.peq` · `.micro` · `.mono` · `.num` (tabular) · `.fio` / `.fio-forte` · `.sr` (só leitor de tela) · `.exemplo` (acrescenta "exemplo").

## Layout

```html
<section class="sec campo-dia" id="cap-18-b" data-titulo="18 · Fotografia">
  <div class="in">            <!-- 1240 px; .in-largo 1480; .in-texto 720 -->
    <div class="cab">
      <p class="rot">18.2 <span class="n">· Luz</span></p>
      <h2>Luz de janela, <em>nunca de estúdio</em>.</h2>
      <p class="lead">Texto de apoio alinhado à base, quatro colunas à direita.</p>
    </div>
    <div class="bloco">
      <div class="st"><span class="k">18.2.1</span><h3>Luz lateral</h3><p>Resumo curto.</p></div>
      <div class="sc"> … conteúdo nas 8 colunas da direita … </div>
    </div>
  </div>
</section>
```

- `.sec` (padding vertical `--pad-sec`) · `.sec.compacta` · `.sec.sem-topo`. Variações do cabeçalho: `.cab.empilhada`.
- `.bloco` (título fixo à esquerda, sticky) · `.bloco.cheio` (título em cima, conteúdo na largura toda).
- `.g12` com filhos `.c-1 … .c-12` e deslocamento `.de-2 … .de-9`; `.fim`/`.meio` alinham. Em 1100 px e 760 px as colunas se reorganizam (no celular tudo vira largura total).
- `.g2 .g3 .g4 .g5` grades simples · `.pilha`, `.pilha-g`, `.linha-flex` · `.espaco` (respiro de bloco).
- **Sangria:** `.sangria` precisa ser FILHA DIRETA de `.sec` (fora do `.in`): anula a margem lateral. `.sangria.topo` / `.sangria.base` encostam no topo/base da seção.

## Abertura de capítulo (página inteira)

```html
<section class="sec abertura campo-noite" id="cap-06" data-titulo="06 · Anatomia e construção">
  <div class="ab-fundo veu" aria-hidden="true"> <!-- opcional: foto, radar, grade --> </div>
  <div class="in-largo">
    <div class="ab-topo"><span>Parte <b>II</b> · Logotipo</span><span>Capítulo 06 de 44</span></div>
    <span class="ab-num" aria-hidden="true">06</span>
    <div class="ab-corpo">
      <h2 class="ab-titulo">Um anel, uma haste, <em>um arco</em>.</h2>
      <p class="ab-lead">Uma ou duas frases que dizem por que o capítulo importa.</p>
      <ul class="ab-indice"><li><span>06.1</span>Geometria</li><li><span>06.2</span>Grade de construção</li></ul>
    </div>
  </div>
</section>
```

- Variações: `.ab-num.contorno` (número só em traço) · `.abertura.com-visual` + `<div class="ab-visual">…</div>` (visual no alto à direita, número à direita, texto à esquerda) · `.ab-fundo` (camada de fundo; `.veu` escurece a base na noite e clareia no dia; dentro dela `<img>` cobre tudo ou um `data-gforms`).
- Personalize com `#cap-NN .ab-…` no seu `<style>`; não reinvente a estrutura.

## Foto, faixa e legenda

```html
<figure>
  <div class="foto trat-cor" style="--prop:4/5;--foco-xy:40% 30%"><img src="assets/fotos/x.jpg" alt="Descrição da cena"></div>
  <figcaption class="legenda"><span class="n">Fig. 18.3</span><span><b>Luz lateral.</b> O dono olha a tela, não a câmera.</span></figcaption>
</figure>
<div class="faixa-foto sangria veu" style="--prop:21/9;--prop-cel:4/5">
  <div class="foto trat-mono"><img src="assets/fotos/y.jpg" alt=""></div>
  <div class="faixa-texto"><h2>Título sobre a foto, <em>em itálico</em>.</h2></div>
</div>
```

- `.foto` (proporção `--prop`, enquadramento `--foco-xy`, raio `--r-fig`) · `.trat-cor` (grade Noite: sombras azul-noite, meios-tons −25%) · `.trat-mono` (duotone `#0B0D12 → #EEF1F5`).
- `.foto.vaga` com `data-cena="Cena: …"` quando a foto ainda não existe (descreve a cena; nunca enchimento).
- `.faixa-foto` (sangria quando filha de `.sec` + `.sangria`; `.veu` para texto; `--prop-cel` no celular).

## Citações e notas

- `.citacao` (figure > blockquote > p + figcaption): citação grande, aspas penduradas.
- `.frase`: ideia solta em Newsreader, sem caixa.
- `.pull` (dentro de `.prosa`; `.pull.dir` / `.pull.esq` flutuam no desktop).
- `.com-notas` (texto + `<aside>`) com `.nota-lateral` (`.k` rótulo laranja).
- `.prosa` (coluna de leitura 720 px) · `.capitular` (letra inicial grande) · `.prosa-2col`.

## Peça, palco e medidas

```html
<figure class="peca">
  <span class="cota-l">1080 px</span>
  <div class="m-post"><div class="tela campo-noite"> … </div></div>
  <span class="cota-a">1350 px</span>
  <figcaption class="medida"><b>Post</b> 1080 × 1350 · 4:5 · <i>destaque</i></figcaption>
</figure>
```

- `.grade-pecas` (auto-fit, mínimo `--min`, padrão 240 px; `.topo` alinha em cima) · `.peca` (cota de largura em cima, cota de altura à direita, medida embaixo; no celular a cota de altura some).
- `.palco` (fundo do campo, proporção `--prop`, respiro `--pad`; `.et` etiqueta; `.sem-borda`, `.laranja`, `.grade-fundo`).
- `.risco` (diagonal vermelha de "não faça" sobre qualquer peça) · `.corte` (marcas de corte em volta de impresso).

## Molduras de dispositivo e formato

Toda moldura contém uma `.tela`. **Dentro da `.tela`, `var(--u)` vale 1 px do arquivo real**: escreva medidas nativas, a escala é automática (container queries). Não use `var(--u)` na própria `.tela`, só nos filhos.

| Classe | Formato nativo (`--nat` × proporção) | Observação |
|---|---|---|
| `.m-navegador` | 1440 × 900 (16:10) | `<div class="barra-nav"><i></i><i></i><i></i><span>growai.com.br</span></div>` antes da tela; `.escuro`; `.tela.rola` + `--altura` para página longa |
| `.m-celular` | 390 × 844 | largura `--w` (padrão 300 px); ilha e botão desenhados |
| `.m-tablet` | 834 × 1194 · `.deitado` 1194 × 834 | `--w` 460 / 640 |
| `.m-cartao` | 85 × 55 mm (850 px nativos, 10 px = 1 mm) | `.par-cartoes` sobrepõe frente e verso |
| `.m-a4` | 210 × 297 mm (794 px) · `.deitado` | papel branco, sombra de papel |
| `.m-slide` | 1920 × 1080 (16:9) | |
| `.m-post` | 1080 × 1350 (4:5) | |
| `.m-quadrado` | 1080 × 1080 | |
| `.m-story` | 1080 × 1920 (9:16) | `<div class="zonas"></div>` mostra zonas seguras (250 px topo, 340 px base) |
| `.m-banner` | 1584 × 396 (LinkedIn) | troque `--nat`/`--prop` para outros banners (ex.: YouTube 2560 × 1440) |
| `.m-thumb` | 1280 × 720 | |
| `.m-og` | 1200 × 630 | |

Utilitários dentro da tela (todos em px nativos):

- `.t-display` (`--fs`, padrão 96) · `.t-texto` (`--fs` 32) · `.t-rot` (`--fs` 22) · `.t-num` (`--fs` 160) · `.px` (só tamanho, `--fs`)
- `.logo` (altura `--h`, padrão 44) · `.btn-u` (botão em escala, `--fs`) · `.area` (coluna flexível com margem `--m`, padrão 80; empurra o primeiro item para cima e o último para baixo) · `.entre` (linha com extremos) · `.abs` · `.pad` (`--p`) · `.fundo-radar` (posicione com `right/top/width` em `calc(N * var(--u))` e um `data-gforms`) · `img.cobre` (foto de fundo).

```html
<div class="m-post"><div class="tela campo-noite">
  <div class="area">
    <span class="t-rot" style="--fs:24">Tese · 01</span>
    <p class="t-display" style="--fs:96">Falta de lead raramente é o problema. <em>O problema é onde ele trava.</em></p>
    <div class="entre"><img class="logo" style="--h:44" src="assets/growai-logo-claro.svg" alt=""><span class="t-rot" style="--fs:20">growai.com.br</span></div>
  </div>
</div></div>
```

## Componentes de conteúdo

- `.cartao` (`.k`, `h4`, `p`) · `.cartao.foco` · `.cartao.limpo` (só fio no topo). Cartão só quando o conteúdo é um objeto.
- `ol.lista` (numeração automática; `<li><span><b>Título</b>texto</span></li>`) · `ul.lista` (primeiro `<span>` vira marcador mono) · `ul.pontos` / `ul.pontos.foco`.
- **Tabela:** `<div class="tabela-wrap" tabindex="0" role="region" aria-label="…"><table class="tab">…</table></div>` + `<p class="dica-rola">Deslize a tabela para o lado →</p>` (aparece só no celular). Coluna numérica `.n`; linha do gargalo `tr.foco`; amostra de cor `<span class="sw" style="background:#…"></span>`; largura mínima `--min-tab`.
- **Pílulas:** `.pill.sim` · `.pill.at` · `.pill.nao` · `.pill.neutra`.
- **Faz / não faz:** `.faz-nao > .faz | .nao`, cada um com `<div class="cab-fn"><b>Faça</b><span class="pill sim">Certo</span></div>`, a peça e um `<p>`.
- **Especificação:** `.spec` (descrição + `dl.dl` à esquerda, `.codigo` à direita). Código: `<div class="codigo"><header><span>css · tokens</span><button class="copiar" type="button">Copiar</button></header><pre>…</pre></div>`. Realce opcional: `.c` comentário, `.s` texto, `.p` propriedade, `.v` valor. `data-copiar="#id"` copia outro `<pre>`; qualquer elemento com `data-copiar-texto="#FF6A1A"` copia o texto ao clicar.
- **Cor:** `.swatches > .swatch` com `<button class="chip" style="--c:#hex;--c-txt:#hex" data-copiar-texto="#hex"><b>Nome</b><span class="hex">#hex</span></button><dl>…</dl>`; `.swatch.grande` ocupa duas colunas. `.proporcao` com filhos `style="--p:40;--c:#…"`.
- **Tipo:** `.especime` (`.glifo` + `.meta` com `.nome`, `.alfabeto`, `.pesos`; famílias `.ff-display`, `.ff-texto`, `.ff-mono`) · `.escala-tipo` (linhas medida → amostra).

## Componentes da marca

- `.btn` (laranja, texto `#170A02`; `.seta` anda no hover) · `.btn.btn-sec` · `.btn-link` · `.peq` · `.cheio`.
- `.selo-linha.edu | .str | .age` (no dia preenchido; na noite contorno).
- `.restricao` (`<b>Restrição atual</b><p>…</p>`) · `.aviso` (`<b>Gargalo encontrado</b>texto`) · `.kpi` (`.k`, `.v` com `<small>`, `.d`, `.d.sobe`, `.d.desce`; `.kpi.foco`) dentro de `.kpis` · `.cita` (`<p>` + `<small>`) · `.nota` · `.fonte`.
- Motores: `.radar-box` (`--max`) + `data-gforms="radar"`, `.forma`, `.grafico` + `data-gviz`. A casca troca a fonte do aviso do radar para a tipografia v4.

## Casca, capa, barra e rodapé

- Barra superior fixa (escondida na capa; reaparece quando recebe foco do teclado): símbolo "g" (abaixo de 80 px o logo inteiro vira só o g), parte, capítulo atual (`data-titulo` "NN · Título"), contador `NN / 44`, Sumário e Topo, progresso laranja.
- Capa (`parts/00-capa.html`): `.capa`, `.capa-radar`, `.capa-topo`, `.capa-corpo`, `.capa-meta`. Sumário: `.sumario`, `.sum-cab`, `.sum-parte` (gerado de `partes.py`; se mudar um título de capítulo, mude em `partes.py` e regenere o sumário).
- Abertura de parte: `.parte-abre` (`.pa-num`, `.pa-titulo`, `.pa-lista`, `.pa-fundo`), gerada por `partes.abertura_parte()`.
- Rodapé `.rodape` noite com a assinatura.
- `.revela`: aparece suave ao entrar na tela (desligado com movimento reduzido e na impressão).

## Responsivo, movimento e impressão

- Pontos de quebra: 1600 (contêiner 1280), 1100 (cabeçalhos e blocos empilham, grades viram 2), 760 (tudo em 1 coluna, corpo 17 px, cotas de altura somem), 420 (ajustes de barra e capa). Verificado de 320 a 1600 px sem rolagem lateral.
- `prefers-reduced-motion`: animações e transições cortadas; radar parado com o ponto aceso (motor).
- Impressão A4: barra, botões de copiar e controles somem, caixas com rolagem saem inteiras, aberturas começam em página nova, peças não quebram. `exportar_pdf.py` falha em voz alta se o PDF sair sem texto.
- Blocos `.codigo pre` recebem foco de teclado e nome (`role=region`) pelo script da casca; o botão Copiar tem 44 px de altura e anuncia o resultado numa região `aria-live`.
