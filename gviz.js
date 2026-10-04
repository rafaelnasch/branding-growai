/* =====================================================================
   GVIZ · motor de gráficos da GrowAI · sistema Radar de Foco v3
   SVG puro, zero dependências, JavaScript ES2015 simples e determinístico
   (sem Math.random, sem Date): mesma entrada e mesma largura geram sempre o
   mesmo desenho, na tela, no PDF e no arquivo levado ao Canva.

   COMO USAR (três formas)
     1. Declarativa, sem escrever JavaScript (o motor monta sozinho):
        <div data-gviz='{"tipo":"barras","sobretitulo":"Propostas por semana",
             "titulo":"A terceira semana concentra o atraso",
             "rotulos":["S1","S2","S3","S4"],"valores":[12,14,31,11],"destaque":2,
             "fonte":"CRM do cliente","data":"set. 2026"}'></div>
     2. Por chamada: gviz.render(el, 'barras', {...})  ou  gviz.barras('id', {...}).
     3. Para salvar ou levar ao Canva: gviz.svg(el) devolve o SVG de um gráfico da
        página; gviz.svg('barras', {..., campo:'noite', largura:960}) desenha fora da
        página. O SVG sai com xmlns, width, height e toda cor em HEX.

   CAMPO (noite | dia) E COR
     Sem opção, o motor lê a cor de fundo REAL atrás do gráfico (sobe a árvore até achar
     um fundo opaco): escuro vira Noite, claro vira Dia. Com "campo":"noite"|"dia" usa a
     paleta fixa. Noite: fundo #0B0D12, texto #EEF1F5, apoio #9AA3B2, linha #232936.
     Dia: fundo #FFFFFF, texto #0C0F14, apoio #4A525E, linha #E4E7EB.
     "linha":"educacao"|"strategy"|"agentes" pinta a série principal com a cor da linha
     (Dia: #D63A7A, #2F5BEA, #12A877; Noite: #FF8DB8, #8FA8FF, #3DDC9F). Sem linha, a
     série é neutra (cinza com pelo menos 3:1 sobre o fundo).
     LARANJA SÓ NO FOCO: #FF6A1A aparece apenas no item marcado em "destaque" (índice).
     O número do destaque sai em texto forte com um ponto laranja ao lado; laranja como
     TEXTO pequeno usa #B33E0A no Dia e #FF8A4C na Noite (contraste 4,5:1 garantido).
     Um destaque por gráfico. Semânticas (bom/atenção/crítico) não entram no motor.

   TIPOGRAFIA
     Sobretítulo em JetBrains Mono caixa alta (12 px, espaçado); título em Sora 600
     (escreva a CONCLUSÃO, não o assunto); rótulos em Source Sans 3 (mínimo 13 px);
     valores e números em JetBrains Mono. Rodapé com fonte e data é OBRIGATÓRIO: sem
     "fonte", o rodapé diz "Dado ilustrativo · fonte a informar" e o console avisa.

   OPÇÕES COMUNS (pt-BR; aliases em inglês também valem)
     sobretitulo  rótulo mono acima do título
     titulo       conclusão do gráfico (Sora)
     fonte, data  rodapé obrigatório ("CRM do cliente", "set. 2026")
     destaque     índice do único item em laranja (-1 = nenhum)
     campo        'noite' | 'dia' (padrão: lido do fundo real)
     linha        'educacao' | 'strategy' | 'agentes' (cor da série principal)
     vrotulos     valores já formatados em pt-BR ("R$ 1,2 mi", "38%")
     unidade      unidade no fim da linha de base ("PROPOSTAS", "%")
     altura       altura da área do gráfico; largura: viewBox (padrão = contêiner, 280–1200)
     animar       true: entrada discreta (nunca em print, prefers-reduced-motion ou robô)
     aria, desc   nome e descrição acessíveis (<title>/<desc>; desc é gerada se faltar)
     rodape       false só quando a legenda HTML logo abaixo já traz fonte e data

   TIPOS
     barras       { rotulos, valores, vrotulos, destaque, unidade, altura, valores2, series }
     ranking      { rotulos, valores, vrotulos, destaque }            (barras deitadas)
     linha        { rotulos, valores, vrotulos, destaque, area, todos, valores2, series,
                    referencia:{valor, rotulo} }                       (linha tracejada de meta)
     composicao   { segmentos:[{rotulo, valor, vrotulo}], destaque }   (partes de um todo)
     anel         { valor (0–100), vrotulo, rotulo, destaque:true }    (laranja só com destaque)
     funil        { etapas:[{rotulo, valor, vrotulo}], destaque, taxas }
     fluxo        { passos:[{rotulo, sub}], destaque, numeros }
     numero       { valor, vrotulo, unidade, rotulo, sub, serie, destaque:true }
     linha-tempo  { eventos:[{data, rotulo, sub}], destaque }          (destaque = "agora")
     cota         { rotulo }                                           (medida entre dois traços)
     bowtie       { etapas (padrão M1 Lead … M8 Expansão), valores, vrotulos, taxas,
                    gargalo (índice 0–7, laranja), lados:['Antes da venda','Depois da venda'] }
                  Largo: gravata deitada (M1–M4 afunilam, M5 é o nó, M6–M8 abrem).
                  Estreito (< 560): gravata em pé, uma etapa por linha.

   FUNÇÕES
     gviz.<tipo>(el, opts) · gviz.render(el, tipo, opts) · gviz.montar(raiz)
     gviz.redesenhar() · gviz.svg(el | tipo, opts) · gviz.fmt(n, {dec, prefixo, sufixo})
     gviz.contraste(a, b) · gviz.paletas · gviz.animar = false (desliga a entrada)

   EXEMPLOS
     <div data-gviz='{"tipo":"bowtie","titulo":"O gargalo está na passagem para SQL",
          "valores":[1240,410,96,61,38,35,29,11],"gargalo":2,"linha":"strategy",
          "fonte":"Exemplo ilustrativo","data":"out. 2026"}'></div>
     <div data-gviz='{"tipo":"numero","vrotulo":"62%","rotulo":"da receita em aberto está
          em propostas paradas há mais de 9 dias","destaque":true,"fonte":"Exemplo"}'></div>
   ===================================================================== */
const gviz = (() => {
  'use strict';
  const registro = new Set();
  const temDoc = typeof document !== 'undefined';
  let seq = 0, seqX = 0;

  /* ---------- paletas da casa ---------- */
  const FOCO = '#FF6A1A';
  const PALETAS = {
    noite: { fundo: '#0B0D12', sup: '#141821', fio: '#232936', texto: '#EEF1F5', apoio: '#9AA3B2', focoTxt: '#FF8A4C' },
    dia: { fundo: '#FFFFFF', sup: '#F6F7F8', fio: '#E4E7EB', texto: '#0C0F14', apoio: '#4A525E', focoTxt: '#B33E0A' }
  };
  const LINHAS = {
    educacao: { dia: '#D63A7A', diaTxt: '#A82259', noite: '#FF8DB8' },
    strategy: { dia: '#2F5BEA', diaTxt: '#1E3FB8', noite: '#8FA8FF' },
    agentes: { dia: '#12A877', diaTxt: '#0B7A56', noite: '#3DDC9F' }
  };
  const LINHA_ALIAS = { 'educação': 'educacao', edu: 'educacao', str: 'strategy', estrategia: 'strategy', age: 'agentes', agente: 'agentes' };

  function hex(v) {
    v = String(v || '').trim();
    let m;
    if (/^#[0-9a-f]{3}$/i.test(v)) return ('#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toUpperCase();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toUpperCase();
    if (/^#[0-9a-f]{8}$/i.test(v)) return v.slice(0, 7).toUpperCase();
    m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?/i);
    if (m) {
      if (m[4] != null && parseFloat(m[4]) === 0) return null;
      return '#' + [m[1], m[2], m[3]].map(n => ('0' + Math.max(0, Math.min(255, Math.round(+n))).toString(16)).slice(-2)).join('').toUpperCase();
    }
    return null;
  }
  function mistura(a, b, t) {
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const x = p(a), y = p(b);
    return '#' + x.map((v, i) => ('0' + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2)).join('').toUpperCase();
  }
  function luz(h) {
    const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function contraste(a, b) {
    const la = luz(a), lb = luz(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  /* aproxima a cor do texto até fechar o contraste pedido */
  function garante(cor, fundo, alvoC, texto) {
    let t = 0, c = cor;
    while (contraste(c, fundo) < alvoC && t < 1) { t += 0.05; c = mistura(cor, texto, t); }
    return c;
  }
  const nomeLinha = l => { l = String(l || '').toLowerCase(); return LINHAS[l] ? l : (LINHA_ALIAS[l] || null); };
  function completa(c, o) {
    c.escuro = luz(c.fundo) < 0.2;
    const base = c.escuro ? PALETAS.noite : PALETAS.dia;
    ['sup', 'fio', 'texto', 'apoio', 'focoTxt'].forEach(k => { if (!c[k]) c[k] = base[k]; });
    c.foco = FOCO;
    if (contraste(c.apoio, c.fundo) < 4.5) c.apoio = garante(c.apoio, c.fundo, 4.5, c.texto);
    if (contraste(c.focoTxt, c.fundo) < 4.5) c.focoTxt = c.escuro ? '#FF8A4C' : '#B33E0A';
    c.neutro = garante(mistura(c.fundo, c.texto, c.escuro ? 0.32 : 0.30), c.fundo, 3, c.texto);
    c.neutro2 = mistura(c.neutro, c.fundo, 0.45);
    c.base = mistura(c.fundo, c.texto, c.escuro ? 0.42 : 0.55);
    const ln = nomeLinha(o && o.linha);
    c.linha = ln;
    if (ln) {
      c.serie = c.escuro ? LINHAS[ln].noite : LINHAS[ln].dia;
      c.serieTxt = c.escuro ? LINHAS[ln].noite : LINHAS[ln].diaTxt;
    } else { c.serie = c.neutro; c.serieTxt = c.apoio; }
    /* segunda série: sempre neutra, mais clara que a principal */
    c.serie2 = ln ? c.neutro : garante(mistura(c.fundo, c.texto, c.escuro ? 0.6 : 0.62), c.fundo, 3, c.texto);
    return c;
  }
  function fundoReal(el) {
    try {
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor, m = bg && bg.match(/rgba?\(([^)]*)\)/);
        if (!m) continue;
        const partes = m[1].split(/[\s,/]+/).filter(Boolean);
        if (partes.length < 4 || parseFloat(partes[3]) > 0.5) return hex(bg);
      }
    } catch (err) { /* sem estilo calculado */ }
    return null;
  }
  function cores(el, o) {
    if (o && o.campo && PALETAS[o.campo]) return completa(Object.assign({}, PALETAS[o.campo]), o);
    const real = el ? fundoReal(el) : null;
    if (!real) return completa(Object.assign({}, PALETAS.dia), o);
    const escuro = luz(real) < 0.2;
    return completa(Object.assign({}, escuro ? PALETAS.noite : PALETAS.dia, { fundo: real }), o);
  }

  /* ---------- tipografia no SVG ---------- */
  const TIT = "font-family:'Sora',system-ui,sans-serif";
  const LAB = "font-family:'Source Sans 3','Source Sans Pro',system-ui,sans-serif;font-variant-numeric:lining-nums tabular-nums";
  const MONO = "font-family:'JetBrains Mono',ui-monospace,'SF Mono',Menlo,monospace;font-variant-numeric:tabular-nums";
  const fonte = (f, peso, tam, ls) => `${f};font-weight:${peso};font-size:${tam}px` + (ls ? `;letter-spacing:${ls}px` : '');
  const r2 = v => Math.round(v * 100) / 100;
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const alvo = e => (typeof e === 'string' ? (temDoc ? document.getElementById(e) : null) : e);
  const dois = n => (n < 10 ? '0' : '') + n;
  const FS = 14, FP = 13, FM = 12, LSM = 1.6;
  function T(x, y, conteudo, f, peso, tam, cor, anc, ls, extra) {
    return `<text x="${r2(x)}" y="${r2(y)}"${anc && anc !== 'start' ? ` text-anchor="${anc}"` : ''} fill="${cor}" style="${fonte(f, peso, tam, ls)}"${extra || ''}>${esc(conteudo)}</text>`;
  }
  const R = (x, y, w, h, cor, extra) => `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(Math.max(0, w))}" height="${r2(Math.max(0, h))}" fill="${cor}"${extra || ''}/>`;
  const L = (x1, y1, x2, y2, cor, w, extra) => `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="${cor}" stroke-width="${w || 1}"${extra || ''}/>`;
  const C = (cx, cy, r, fill, extra) => `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="${fill}"${extra || ''}/>`;
  /* o PONTO DE FOCO: ponto laranja com halo (o radar achou) */
  const PF = (cx, cy, r, c) => C(cx, cy, r * 2.1, c.foco, ' fill-opacity=".18" data-a="p"') + C(cx, cy, r, c.foco, ' data-a="p"');

  /* ---------- medição de texto (SVG oculto; sem medida, estima) ---------- */
  const cache = new Map();
  let medidor = null;
  function mede(txt, f, peso, tam, ls) {
    txt = String(txt);
    const k = f.length + '|' + peso + '|' + tam + '|' + (ls || 0) + '|' + txt;
    if (cache.has(k)) return cache.get(k);
    let w = 0;
    try {
      if (temDoc && document.body) {
        if (!medidor || !medidor.isConnected) {
          const NS = 'http://www.w3.org/2000/svg';
          medidor = document.createElementNS(NS, 'svg');
          medidor.setAttribute('aria-hidden', 'true');
          medidor.setAttribute('width', '1'); medidor.setAttribute('height', '1');
          medidor.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none';
          medidor.appendChild(document.createElementNS(NS, 'text'));
          document.body.appendChild(medidor);
        }
        const t = medidor.firstChild;
        t.setAttribute('style', fonte(f, peso, tam, ls));
        t.textContent = txt;
        w = t.getComputedTextLength();
      }
    } catch (err) { w = 0; }
    if (!w) w = txt.length * (f === MONO ? 0.6 : (f === TIT ? 0.58 : 0.5)) * tam + (ls || 0) * txt.length;
    cache.set(k, w);
    return w;
  }
  function quebra(txt, f, peso, tam, maxW, maxL, ls) {
    const pal = String(txt).split(/\s+/).filter(Boolean);
    if (!pal.length) return [''];
    const linhas = [];
    let atual = pal[0];
    for (let i = 1; i < pal.length; i++) {
      const tenta = atual + ' ' + pal[i];
      if (mede(tenta, f, peso, tam, ls) <= maxW) atual = tenta;
      else { linhas.push(atual); atual = pal[i]; }
    }
    linhas.push(atual);
    if (maxL && linhas.length > maxL) {
      const cab = linhas.slice(0, maxL - 1);
      cab.push(linhas.slice(maxL - 1).join(' '));
      return cab;
    }
    return linhas;
  }
  const maiorPalavra = (textos, f, peso, tam, ls) => Math.max(0, ...textos.map(t => Math.max(0, ...String(t || '').split(/\s+/).map(w => mede(w, f, peso, tam, ls)))));
  /* tamanho que faz o texto caber na largura (sem passar do máximo nem do mínimo) */
  const cabeEm = (txt, f, peso, max, min, w, ls) => { const m = mede(txt, f, peso, max, ls); return m <= w ? max : Math.max(min, max * w / m); };

  /* ---------- números em pt-BR ---------- */
  function fmt(n, o) {
    o = o || {};
    const dec = o.dec == null ? 0 : o.dec;
    const neg = n < 0;
    const partes = Math.abs(Number(n) || 0).toFixed(dec).split('.');
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '-' : '') + (o.prefixo || '') + inteiro + (dec > 0 ? ',' + partes[1] : '') + (o.sufixo || '');
  }
  function auto(v) {
    if (typeof v !== 'number' || !isFinite(v)) return String(v);
    if (Number.isInteger(v)) return fmt(v);
    return fmt(v, { dec: Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? 1 : 2 });
  }
  const rotulos = (vals, vl) => vals.map((v, i) => (vl && vl[i] != null ? String(vl[i]) : auto(v)));

  /* ---------- largura do viewBox ---------- */
  function largura(el, o) {
    if (o.w) return o.w;
    let cw = 0;
    try {
      const cs = getComputedStyle(el);
      cw = el.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    } catch (err) { cw = 0; }
    if (!cw || cw <= 0) return 640;
    return Math.round(Math.max(280, Math.min(1200, cw)));
  }

  /* ---------- entrada discreta (respeita prefers-reduced-motion) ---------- */
  const agora = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : 0);
  function semMovimento() {
    try {
      if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
      return !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('print').matches;
    } catch (err) { return true; }
  }
  let ioAnima = null;
  function animaQuando(el, o) {
    if (o.animar === false || api.animar === false || !temDoc || semMovimento()) return;
    if (typeof IntersectionObserver === 'undefined' || !Element.prototype.animate) return;
    if (el.__gvT != null) { const dt = agora() - el.__gvT; if (dt < 1100) anima(el, dt); return; }
    if (!ioAnima) ioAnima = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      ioAnima.unobserve(en.target);
      en.target.__gvT = agora();
      anima(en.target, 0);
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    if (!el.__gvObs) { el.__gvObs = 1; ioAnima.observe(el); }
  }
  function anima(el, desde) {
    const svg = el.firstElementChild;
    if (!svg) return;
    let i = 0;
    Array.prototype.forEach.call(svg.querySelectorAll('[data-a]'), n => {
      const a = n.getAttribute('data-a'), atraso = Math.min(i++, 10) * 45;
      const ops = { duration: 680, delay: atraso, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' };
      let k = null;
      try {
        if (a === 'y' || a === 'x' || a === 'xc') {
          n.style.transformBox = 'fill-box';
          n.style.transformOrigin = a === 'y' ? '50% 100%' : (a === 'x' ? '0% 50%' : '50% 50%');
          k = n.animate(a === 'y' ? [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }] : [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], ops);
        } else if (a === 'd') {
          const tam = n.getTotalLength ? n.getTotalLength() : 0;
          if (tam) k = n.animate([{ strokeDasharray: tam + ' ' + tam, strokeDashoffset: tam }, { strokeDasharray: tam + ' ' + tam, strokeDashoffset: 0 }], Object.assign({}, ops, { duration: 1000 }));
        } else if (a === 'r') {
          const v = n.getAttribute('data-v'), tot = n.getAttribute('data-c');
          k = n.animate([{ strokeDasharray: '0 ' + tot }, { strokeDasharray: v + ' ' + tot }], Object.assign({}, ops, { duration: 1000 }));
        } else if (a === 'p') {
          n.style.transformBox = 'fill-box'; n.style.transformOrigin = '50% 50%';
          k = n.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], Object.assign({}, ops, { delay: atraso + 420, duration: 420 }));
        } else {
          k = n.animate([{ opacity: 0 }, { opacity: 1 }], ops);
        }
        if (k && desde) k.currentTime = desde;
      } catch (err) { /* sem suporte: fica o desenho final */ }
    });
  }
  function terminaAnimacoes() {
    registro.forEach(el => {
      try { const s = el.firstElementChild; if (s && s.getAnimations) s.getAnimations({ subtree: true }).forEach(a => a.finish()); } catch (err) { /* ok */ }
    });
  }

  /* ---------- cabeça (sobretítulo + título), rodapé (fonte e data) e montagem ---------- */
  function registra(el, tipo, o) { el.__gviz = { tipo, opts: o }; registro.add(el); observa(el); }
  function cabeca(c, W, o) {
    let s = '', y = 0;
    if (o.sobretitulo) {
      const ls = quebra(String(o.sobretitulo).toUpperCase(), MONO, 500, FM, W, 2, LSM);
      ls.forEach(ln => { y += 16; s += T(0, y - 3, ln, MONO, 500, FM, c.linha ? c.serieTxt : c.apoio, 'start', LSM); });
      y += 10;
    }
    if (o.titulo) {
      const tam = W < 420 ? 20 : (W < 720 ? 23 : 27);
      const ls = quebra(o.titulo, TIT, 600, tam, W, 4, -tam * 0.02);
      ls.forEach(ln => { y += tam * 1.2; s += T(0, y - tam * 0.26, ln, TIT, 600, tam, c.texto, 'start', r2(-tam * 0.02)); });
      y += 20;
    }
    return { s, h: y };
  }
  function textoRodape(o) {
    let txt = o.fonte ? 'Fonte: ' + o.fonte : 'Dado ilustrativo · fonte a informar';
    if (o.data) txt += ' · ' + o.data;
    return txt;
  }
  function rodape(c, W, y0, o) {
    if (o.rodape === false) return { s: '', h: 0 };
    if (!o.fonte && !o.__avisado) { o.__avisado = 1; try { console.warn('gviz: gráfico sem "fonte"; o rodapé saiu como dado ilustrativo.', o.titulo || o.tipo); } catch (err) { /* ok */ } }
    const ls = quebra(textoRodape(o), LAB, 400, FP, W, 3);
    let s = L(0, y0 + 18.5, Math.min(W, 48), y0 + 18.5, c.fio, 1);
    ls.forEach((ln, k) => { s += T(0, y0 + 38 + k * 18, ln, LAB, 400, FP, c.apoio, 'start'); });
    return { s, h: 30 + ls.length * 18 };
  }
  function descricao(o) {
    if (o.desc) return String(o.desc);
    const par = (l, v) => l.map((x, i) => x + ': ' + v[i]).join('; ');
    try {
      if (o.labels && o.values) return par(o.labels, rotulos(o.values.map(Number), o.vlabels)) + '.';
      if (o.segments) return o.segments.map(t => (t.label || '') + ': ' + (t.vlabel != null ? t.vlabel : auto(+t.value || 0))).join('; ') + '.';
      if (o.stages && o.stages.length && typeof o.stages[0] === 'object') return o.stages.map(t => (t.label || '') + ': ' + (t.vlabel != null ? t.vlabel : auto(+t.value || 0))).join('; ') + '.';
      if (o.steps) return o.steps.map((t, i) => (i + 1) + '. ' + (t.label || '')).join('; ') + '.';
      if (o.eventos) return o.eventos.map(t => (t.data || '') + ': ' + (t.label || '')).join('; ') + '.';
      if (o.value != null) return (o.vlabel != null ? o.vlabel : auto(+o.value)) + (o.label ? ' ' + o.label : '') + '.';
    } catch (err) { /* sem descrição */ }
    return '';
  }
  function monta(el, W, H, miolo, o, c, tipo, semRodape) {
    if (!el.__gvId) el.__gvId = 'gv' + (++seq);
    const id = el.__gvId;
    const cab = cabeca(c, W, o);
    const rp = semRodape ? { s: '', h: 0 } : rodape(c, W, cab.h + H, o);
    const nome = o.aria || o.titulo || 'Gráfico';
    const ds = descricao(o) + (semRodape ? '' : ' ' + textoRodape(o) + '.');
    const corpo = cab.h ? `<g transform="translate(0 ${r2(cab.h)})">${miolo}</g>` : miolo;
    el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" data-gviz-tipo="${tipo}" data-campo="${c.escuro ? 'noite' : 'dia'}" viewBox="0 0 ${r2(W)} ${r2(cab.h + H + rp.h)}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false" style="width:100%;height:auto;display:block;overflow:visible"><title id="${id}-t">${esc(nome)}</title><desc id="${id}-d">${esc(ds.trim())}</desc>${cab.s}${corpo}${rp.s}</svg>`;
    animaQuando(el, o);
  }
  const hiDe = o => (o.highlight == null || o.highlight === false ? -1 : (o.highlight === true ? 0 : +o.highlight));
  const inicia = (e, tipo, o) => { const el = alvo(e); if (!el) return null; registra(el, tipo, o); return el; };
  function legenda(c, W, nomes, coresS) {
    let s = '', x = 0, y = 0;
    nomes.forEach((n, i) => {
      const w = mede(n, LAB, 500, FS);
      if (x > 0 && x + 18 + w > W) { x = 0; y += 22; }
      s += R(x, y + 4, 12, 12, coresS[i], ' rx="2"') + T(x + 18, y + 15, n, LAB, 500, FS, c.texto, 'start');
      x += 18 + w + 22;
    });
    return { s, h: y + 32 };
  }
  /* o número do destaque: JetBrains Mono forte, com o ponto de foco ao lado */
  const NUMHI = 26;

  /* =========================================================== BARRAS */
  function bars(e, o) {
    o = o || {};
    const el = inicia(e, 'bars', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o), H0 = o.h || 280;
    const vals = (o.values || []).map(v => +v || 0), labs = (o.labels || []).map(l => String(l == null ? '' : l));
    const v2 = (o.values2 || []).map(v => +v || 0), dupla = v2.length > 0;
    const vls = rotulos(vals, o.vlabels), hi = hiDe(o), n = Math.max(1, vals.length);
    const uTxt = o.unit ? String(o.unit).toUpperCase() : '';
    const cw = W / n;
    let fs = cw < 56 ? 13 : FS;
    if (fs === FS && maiorPalavra(labs, LAB, 500, FS) > cw - 8) fs = 13;
    if (!dupla && o.deitar !== false && maiorPalavra(labs, LAB, 600, 13) > cw - 4) { hbars(el, o, true); return; }
    const lg = dupla ? legenda(c, W, o.series || ['Série 1', 'Série 2'], [c.serie, c.serie2]) : { s: '', h: 0 };
    const H = H0 + lg.h;
    const lh = fs + 4;
    const linhas = labs.map((l, i) => quebra(l, LAB, i === hi ? 600 : 500, fs, cw - 6, 2));
    const nL = Math.max(1, ...linhas.map(l => l.length));
    const pb = 26 + (nL - 1) * lh + 8 + (uTxt ? 20 : 0);
    const hiTam = hi >= 0 ? cabeEm(vls[hi], MONO, 500, NUMHI, 16, Math.max(cw * 1.6, 60)) : 0;
    const pt = lg.h + (hi >= 0 ? hiTam + 30 : 26);
    const base = H - pb, ph = base - pt;
    const max = Math.max(...vals, ...v2, 0) || 1;
    const bw = dupla ? Math.min(26, cw * 0.32) : Math.min(48, cw * 0.56);
    const comuns = vls.filter((t, i) => i !== hi);
    const mostraV = !dupla && Math.max(0, ...comuns.map(t => mede(t, MONO, 500, 13))) <= cw - 4;
    const cabe = (w, cx) => Math.max(w / 2 + 1, Math.min(W - w / 2 - 1, cx));
    let s = lg.s;
    vals.forEach((v, i) => {
      const cx = i * cw + cw / 2, ehHi = i === hi;
      const bh = Math.max(2, (Math.max(0, v) / max) * ph);
      const x1 = dupla ? cx - bw - 2 : cx - bw / 2;
      s += R(x1, base - bh, bw, bh, ehHi ? c.foco : c.serie, ' data-a="y"');
      if (dupla) {
        const bh2 = Math.max(2, (Math.max(0, v2[i] || 0) / max) * ph);
        s += R(cx + 2, base - bh2, bw, bh2, c.serie2, ' data-a="y"');
      }
      const topo = base - bh;
      if (ehHi) {
        const px = dupla ? x1 + bw / 2 : cx;
        const tw = mede(vls[i], MONO, 500, hiTam);
        const xx = cabe(tw + 18, px);
        s += PF(xx - tw / 2 - 2, topo - 12 - hiTam * 0.36, 4, c);
        s += T(xx - tw / 2 + 10, topo - 12, vls[i], MONO, 500, r2(hiTam), c.texto, 'start', 0, ' data-a="f"');
      } else if (mostraV) s += T(cabe(mede(vls[i], MONO, 500, 13), cx), topo - 8, vls[i], MONO, 500, 13, c.apoio, 'middle');
      linhas[i].forEach((ln, k) => {
        const tw = mede(ln, LAB, ehHi ? 600 : 500, fs);
        s += T(cabe(tw, cx), base + 24 + k * lh, ln, LAB, ehHi ? 600 : 500, fs, ehHi ? c.texto : c.apoio, 'middle');
      });
    });
    s += L(0, base + 0.5, W, base + 0.5, c.base, 1);
    if (uTxt) s += T(W, H - 4, uTxt, MONO, 500, FM, c.apoio, 'end', LSM);
    monta(el, W, H, s, o, c, 'barras');
  }

  /* =========================================================== RANKING (barras deitadas) */
  function hbars(e, o, interno) {
    o = o || {};
    const el = interno ? alvo(e) : inicia(e, 'hbars', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const vals = (o.values || []).map(v => +v || 0), labs = (o.labels || []).map(l => String(l == null ? '' : l));
    const vls = rotulos(vals, o.vlabels), hi = hiDe(o);
    const barH = 14, max = Math.max(...vals, 0) || 1, gapV = 10;
    const tamHi = t => cabeEm(t, MONO, 500, 22, 15, W * 0.36);
    const valW = Math.max(0, ...vls.map((t, i) => (i === hi ? mede(t, MONO, 500, tamHi(t)) + 18 : mede(t, MONO, 500, 13)))) + 4;
    const maxLab = Math.max(0, ...labs.map((l, i) => mede(l, LAB, i === hi ? 600 : 500, FS)));
    const labw = o.labw || Math.round(Math.min(W * 0.4, maxLab + 16));
    const empilha = o.empilhar === true || (o.empilhar !== false && (W - labw - valW - gapV) < W * 0.32);
    const barra = (x0, cy, bw, i) => R(x0, cy - barH / 2, bw, barH, i === hi ? c.foco : c.serie, ' data-a="x"');
    const valor = (vx, cy, i) => {
      if (i !== hi) return T(vx, cy + 4.5, vls[i], MONO, 500, 13, c.apoio, 'start');
      const t = r2(tamHi(vls[i]));
      return PF(vx + 4, cy, 4, c) + T(vx + 16, cy + t * 0.36, vls[i], MONO, 500, t, c.texto, 'start', 0, ' data-a="f"');
    };
    let s = '', H;
    if (empilha) {
      const barMax = Math.max(40, W - valW - gapV - 2);
      let y = 0;
      vals.forEach((v, i) => {
        const ehHi = i === hi, peso = ehHi ? 600 : 500;
        const ls = quebra(labs[i], LAB, peso, FS, W, 2);
        ls.forEach((ln, k) => { s += T(0, y + 14 + k * 19, ln, LAB, peso, FS, ehHi ? c.texto : c.apoio, 'start'); });
        const cy = y + 14 + (ls.length - 1) * 19 + 8 + (ehHi ? 15 : 11);
        const bw = Math.max(2, (Math.max(0, v) / max) * barMax);
        s += barra(0, cy, bw, i) + valor(bw + gapV, cy, i);
        y = cy + (ehHi ? 15 : 11) + 14;
      });
      H = Math.max(1, y - 10);
    } else {
      const rowH = 40, barMax = Math.max(40, W - labw - valW - gapV - 8);
      H = Math.max(1, vals.length) * rowH;
      vals.forEach((v, i) => {
        const cy = i * rowH + rowH / 2, ehHi = i === hi;
        const bw = Math.max(2, (Math.max(0, v) / max) * barMax);
        s += barra(labw + 8, cy, bw, i);
        const peso = ehHi ? 600 : 500, corT = ehHi ? c.texto : c.apoio, disp = labw - 10;
        let ls = [labs[i]], fs = FS;
        if (mede(ls[0], LAB, peso, FS) > disp) { fs = 13; ls = quebra(ls[0], LAB, peso, 13, disp, 2); }
        if (ls.length === 1) s += T(labw - 6, cy + fs * 0.36, ls[0], LAB, peso, fs, corT, 'end');
        else ls.forEach((ln, k) => { s += T(labw - 6, cy - 7 + k * 15 + fs * 0.36, ln, LAB, peso, fs, corT, 'end'); });
        s += valor(labw + 8 + bw + gapV, cy, i);
      });
      s += L(labw + 7.5, 0, labw + 7.5, H, c.base, 1);
    }
    monta(el, W, H, s, o, c, 'ranking');
  }

  /* posição do número de destaque sem encostar na linha nem nos outros pontos */
  function lugarLivre(x, y, w, hT, W, base, pts, ignora) {
    const colide = (x0, x1, y0, y1) => {
      if (x0 < 0 || x1 > W || y0 < 0 || y1 > base - 2) return true;
      for (let k = 0; k < pts.length; k++) {
        const serie = pts[k];
        for (let i = 0; i < serie.length - 1; i++) {
          const a = serie[i], b = serie[i + 1], lo = Math.max(x0, a[0]), hi = Math.min(x1, b[0]);
          if (lo > hi) continue;
          const dx = (b[0] - a[0]) || 1;
          const ya = a[1] + (b[1] - a[1]) * (lo - a[0]) / dx, yb = a[1] + (b[1] - a[1]) * (hi - a[0]) / dx;
          if (Math.max(ya, yb) >= y0 - 3 && Math.min(ya, yb) <= y1 + 3) return true;
        }
        for (let i = 0; i < serie.length; i++) {
          if (k === 0 && i === ignora) continue;
          const p = serie[i];
          if (p[0] >= x0 - 6 && p[0] <= x1 + 6 && p[1] >= y0 - 6 && p[1] <= y1 + 6) return true;
        }
      }
      return false;
    };
    const cx = Math.max(w / 2 + 2, Math.min(W - w / 2 - 2, x));
    const opcoes = [
      { x: cx, y: y - 18, a: 'middle', b: [cx - w / 2, cx + w / 2, y - 18 - hT, y - 16] },
      { x: x - 16, y: y - 10, a: 'end', b: [x - 16 - w, x - 16, y - 10 - hT, y - 8] },
      { x: x + 16, y: y - 10, a: 'start', b: [x + 16, x + 16 + w, y - 10 - hT, y - 8] },
      { x: cx, y: y + 16 + hT, a: 'middle', b: [cx - w / 2, cx + w / 2, y + 14, y + 18 + hT], baixo: true },
      { x: x - 16, y: y + 8 + hT, a: 'end', b: [x - 16 - w, x - 16, y + 6, y + 10 + hT], baixo: true },
      { x: x + 16, y: y + 8 + hT, a: 'start', b: [x + 16, x + 16 + w, y + 6, y + 10 + hT], baixo: true }
    ];
    for (let i = 0; i < opcoes.length; i++) { const op = opcoes[i]; if (!colide(op.b[0], op.b[1], op.b[2], op.b[3])) return op; }
    return opcoes[0];
  }

  /* =========================================================== LINHA */
  function line(e, o) {
    o = o || {};
    const el = inicia(e, 'line', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const vals = (o.values || []).map(v => +v || 0), labs = (o.labels || []).map(l => String(l == null ? '' : l));
    const v2 = (o.values2 || []).map(v => +v || 0), dupla = v2.length > 1;
    const vls = rotulos(vals, o.vlabels), n = vals.length, hi = hiDe(o);
    const area = !!o.area, todos = !!o.todos;
    const corL = c.linha ? c.serie : c.texto;
    const lg = dupla ? legenda(c, W, o.series || ['Série 1', 'Série 2'], [corL, c.serie2]) : { s: '', h: 0 };
    const H = (o.h || 250) + lg.h;
    if (!n) { monta(el, W, H, '', o, c, 'linha'); return; }
    const ref = o.referencia || o.meta || null;
    const tH = 24;
    const meia = i => Math.max(mede(labs[i] || '', LAB, i === hi ? 600 : 500, FS), i === hi ? mede(vls[i], MONO, 500, tH) : mede(vls[i], MONO, 500, 13)) / 2;
    const pl = Math.max(14, meia(0) + 4), pr = Math.max(14, meia(n - 1) + 4);
    const pt = lg.h + 50, pb = 38, base = H - pb;
    const todosV = vals.concat(dupla ? v2 : [], ref ? [+ref.valor || +ref.value || 0] : []);
    const max = Math.max(...todosV), min = Math.min(...todosV);
    const lo = area ? Math.min(0, min) : min - (max - min || 1) * 0.3;
    const hiV = max === lo ? lo + 1 : max;
    const px = i => (n === 1 ? W / 2 : pl + (i * (W - pl - pr)) / (n - 1));
    const py = v => pt + (1 - (v - lo) / (hiV - lo)) * (base - pt - 10);
    const pts = vals.map((v, i) => `${r2(px(i))},${r2(py(v))}`).join(' ');
    let s = lg.s;
    if (area) s += `<polygon points="${r2(px(0))},${r2(base)} ${pts} ${r2(px(n - 1))},${r2(base)}" fill="${corL}" fill-opacity="${c.escuro ? '.12' : '.08'}" data-a="f"/>`;
    s += L(0, base + 0.5, W, base + 0.5, c.base, 1);
    let refSerie = null, refRot = '';
    if (ref) {
      const rv = +ref.valor || +ref.value || 0, ry = py(rv);
      refRot = String(ref.rotulo || ref.label || 'Meta').toUpperCase();
      refSerie = [[0, ry], [W, ry]];
      s += L(0, ry, W, ry, c.apoio, 1, ' stroke-dasharray="4 4" data-a="f"');
    }
    const pts0 = vals.map((v, i) => [px(i), py(v)]);
    const series = [pts0];
    if (refSerie) series.push(refSerie);
    if (dupla) {
      const p2 = v2.slice(0, n).map((v, i) => [px(i), py(v)]);
      series.push(p2);
      s += `<polyline points="${p2.map(p => r2(p[0]) + ',' + r2(p[1])).join(' ')}" fill="none" stroke="${c.serie2}" stroke-width="2" stroke-dasharray="1 0" stroke-linejoin="round" stroke-linecap="round" data-a="d"/>`;
      p2.forEach(p => { s += C(p[0], p[1], 3, c.serie2, ' data-a="f"'); });
    }
    const hiW = hi >= 0 ? mede(vls[hi], MONO, 500, tH) : 0;
    const hiPos = hi >= 0 && hi < n ? lugarLivre(px(hi), py(vals[hi]), hiW, tH * 0.8, W, base, series, hi) : null;
    if (refSerie) {
      const rw = mede(refRot, MONO, 500, 11, 1.2), ry = refSerie[0][1];
      const naDireita = !(hi >= 0 && px(hi) > W / 2);
      const rx = naDireita ? W - rw - 4 : 4;
      s += R(rx - 4, ry - 18, rw + 8, 14, c.fundo) + T(rx, ry - 7, refRot, MONO, 500, 11, c.apoio, 'start', 1.2);
    }
    if (hiPos && !hiPos.baixo) s += L(px(hi), py(vals[hi]) + 10, px(hi), base, c.foco, 1, ' stroke-dasharray="2 3" data-a="f"');
    s += `<polyline points="${pts}" fill="none" stroke="${corL}" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round" data-a="d"/>`;
    const mostraV = i => {
      if (i === hi) return true;
      if (!todos && i !== 0 && i !== n - 1) return false;
      if (hi < 0) return true;
      const d = Math.abs(px(i) - px(hi)), wv = mede(vls[i], MONO, 500, 13);
      return d > (wv + hiW) / 2 + 8 || Math.abs(py(vals[i]) - py(vals[hi])) > 30;
    };
    const larg = Math.max(0, ...labs.map((l, i) => mede(l, LAB, i === hi ? 600 : 500, FS)));
    const passo = n > 1 ? (W - pl - pr) / (n - 1) : W;
    const k = Math.max(1, Math.ceil((larg + 10) / passo));
    const fixos = [n - 1]; if (hi >= 0) fixos.push(hi);
    const mostraL = i => fixos.indexOf(i) >= 0 || (i % k === 0 && fixos.every(f => Math.abs(px(i) - px(f)) >= larg + 8));
    vals.forEach((v, i) => {
      if (i === hi) return;
      const x = px(i), y = py(v);
      s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="3.5" fill="${c.fundo}" stroke="${corL}" stroke-width="1.75" data-a="f"/>`;
      if (mostraV(i)) s += T(x, y - 11, vls[i], MONO, 500, 13, c.apoio, 'middle', 0, ' data-a="f"');
    });
    if (hiPos) {
      const x = px(hi), y = py(vals[hi]);
      s += C(x, y, 13, c.foco, ' fill-opacity=".18" data-a="p"') + C(x, y, 6.5, c.foco, ` stroke="${c.fundo}" stroke-width="2" data-a="p"`);
      s += T(hiPos.x, hiPos.y, vls[hi], MONO, 500, tH, c.texto, hiPos.a, 0, ' data-a="f"');
    }
    labs.forEach((l, i) => {
      if (!mostraL(i)) return;
      s += T(px(i), base + 25, l, LAB, i === hi ? 600 : 500, FS, i === hi ? c.texto : c.apoio, 'middle');
    });
    monta(el, W, H, s, o, c, 'linha');
  }

  /* =========================================================== COMPOSIÇÃO (100%) */
  function share(e, o) {
    o = o || {};
    const el = inicia(e, 'share', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const sg = o.segments || [], hi = hiDe(o);
    const barH = 20, sep = 2;
    const tot = sg.reduce((a, t) => a + (+t.value || 0), 0) || 1;
    const tons = [c.serie, mistura(c.serie, c.fundo, 0.4), mistura(c.serie, c.fundo, 0.62), c.serie2];
    let k = 0;
    const cor = sg.map((t, i) => (i === hi ? c.foco : tons[(k++) % tons.length]));
    const vls = sg.map(t => (t.vlabel != null ? String(t.vlabel) : auto(+t.value || 0)));
    let s = '', x = 0, topo = 0;
    if (hi >= 0 && hi < sg.length) {
      let x0 = 0;
      for (let i = 0; i < hi; i++) x0 += ((+sg[i].value || 0) / tot) * W;
      const wSeg = ((+sg[hi].value || 0) / tot) * W;
      const tam = cabeEm(vls[hi], MONO, 500, 30, 18, W * 0.4);
      const nw = mede(vls[hi], MONO, 500, tam);
      const lab = quebra(sg[hi].label || '', LAB, 600, FS, Math.max(80, W - nw - 14), 2);
      const lw = Math.max(...lab.map(l => mede(l, LAB, 600, FS)));
      const bloco = nw + 12 + lw;
      const bx = Math.max(0, Math.min(W - bloco, x0));
      s += T(bx, 32, vls[hi], MONO, 500, r2(tam), c.texto, 'start', 0, ' data-a="f"');
      lab.forEach((ln, j) => { s += T(bx + nw + 12, 30 - (lab.length - 1) * 9 + j * 18, ln, LAB, 600, FS, c.texto, 'start', 0, ' data-a="f"'); });
      s += PF(Math.max(6, Math.min(W - 6, x0 + wSeg / 2)), 50, 4, c);
      topo = 62;
    }
    sg.forEach((t, i) => {
      const w = ((+t.value || 0) / tot) * W;
      const gap = i < sg.length - 1 ? sep : 0;
      s += R(x, topo, w - gap, barH, cor[i], ' data-a="x"');
      x += w;
    });
    const linhaH = 26, y0 = topo + barH + 32;
    let lx = 0, ly = 0;
    sg.forEach((t, i) => {
      const lw = mede(t.label || '', LAB, 500, FS), vw = mede(vls[i], MONO, 500, 13), iw = 12 + 8 + lw + 8 + vw;
      if (lx > 0 && lx + iw > W) { lx = 0; ly++; }
      const yy = y0 + ly * linhaH, ehHi = i === hi;
      s += R(lx, yy - 11, 12, 12, cor[i], ' rx="2"');
      s += T(lx + 20, yy, t.label || '', LAB, 500, FS, ehHi ? c.texto : c.apoio, 'start');
      s += T(lx + 20 + lw + 8, yy, vls[i], MONO, 500, 13, ehHi ? c.texto : c.apoio, 'start');
      lx += iw + 24;
    });
    monta(el, W, y0 + ly * linhaH + 6, s, o, c, 'composicao');
  }

  /* =========================================================== ANEL */
  function ring(e, o) {
    o = o || {};
    const el = inicia(e, 'ring', o); if (!el) return;
    const c = cores(el, o), W0 = largura(el, o), S = Math.min(o.s || 220, W0), W = Math.max(S, o.w || W0), H = S;
    const cx = W / 2, cy = S / 2, r = S / 2 - 14, Cc = 2 * Math.PI * r;
    const frac = Math.min(1, Math.max(0, (+o.value || 0) / 100));
    const vl = o.vlabel != null ? String(o.vlabel) : auto(+o.value || 0) + '%';
    const foco = o.highlight === true || o.highlight === 0 || o.foco === true;
    const corA = foco ? c.foco : (c.linha ? c.serie : c.texto);
    let s = `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="none" stroke="${c.fio}" stroke-width="10"/>`;
    if (frac > 0) {
      s += `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" transform="rotate(-90 ${r2(cx)} ${r2(cy)})" fill="none" stroke="${corA}" stroke-width="10" stroke-dasharray="${r2(Cc * frac)} ${r2(Cc)}" data-a="r" data-v="${r2(Cc * frac)}" data-c="${r2(Cc)}"/>`;
    }
    let tam = S * 0.24;
    const interno = (r - 14) * 2 * 0.84;
    const nw = mede(vl, MONO, 500, tam);
    if (nw > interno) tam = tam * interno / nw;
    const lab = o.label ? String(o.label).toUpperCase() : '';
    const ls = lab ? quebra(lab, MONO, 500, 11, interno * 0.86, 2, 1.3) : [];
    const blocoH = tam * 0.72 + (ls.length ? 12 + ls.length * 15 : 0);
    const topo = cy - blocoH / 2;
    s += T(cx, topo + tam * 0.72, vl, MONO, 500, r2(tam), c.texto, 'middle');
    ls.forEach((ln, k) => { s += T(cx, topo + tam * 0.72 + 23 + k * 15, ln, MONO, 500, 11, c.apoio, 'middle', 1.3); });
    monta(el, W, H, s, o, c, 'anel');
  }

  /* =========================================================== FUNIL */
  function funnel(e, o) {
    o = o || {};
    const el = inicia(e, 'funnel', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const st = o.stages || [], hi = hiDe(o), taxas = !!o.taxas;
    const vls = st.map(t => (t.vlabel != null ? String(t.vlabel) : auto(+t.value || 0)));
    const max = Math.max(...st.map(t => +t.value || 0), 0) || 1;
    const barH = 16, labH = 30, gap = taxas ? 34 : 18;
    const larg = t => Math.max(W * 0.05, Math.min(W, ((+t.value || 0) / max) * W));
    let s = '', y = 0;
    st.forEach((t, i) => {
      const ehHi = i === hi, w = larg(t), x = (W - w) / 2;
      const tHi = 22;
      const valW = ehHi ? mede(vls[i], MONO, 500, tHi) + 18 : mede(vls[i], MONO, 500, 14);
      const lab = quebra(String(t.label == null ? '' : t.label), LAB, ehHi ? 600 : 500, FS, W - valW - 16, 2);
      const extra = (lab.length - 1) * 18;
      lab.forEach((ln, k) => { s += T(0, y + 18 + k * 18, ln, LAB, ehHi ? 600 : 500, FS, ehHi ? c.texto : c.apoio, 'start'); });
      if (ehHi) {
        const nw = mede(vls[i], MONO, 500, tHi);
        s += PF(W - nw - 12, y + 12, 4, c);
        s += T(W, y + 20, vls[i], MONO, 500, tHi, c.texto, 'end', 0, ' data-a="f"');
      } else s += T(W, y + 18, vls[i], MONO, 500, 14, c.texto, 'end');
      const by = y + labH + extra;
      s += R(x, by, w, barH, ehHi ? c.foco : c.serie, ' data-a="xc"');
      y = by + barH;
      if (i < st.length - 1) {
        if (taxas) {
          const a = +t.value || 0, b = +st[i + 1].value || 0;
          const pct = a > 0 ? Math.round((b / a) * 100) : 0;
          s += L(W / 2, y + 4, W / 2, y + 11, c.apoio, 1);
          s += T(W / 2, y + 25, pct + '% seguem', MONO, 500, 12, c.apoio, 'middle');
        }
        y += gap;
      }
    });
    monta(el, W, Math.max(1, y), s, o, c, 'funil');
  }

  /* =========================================================== FLUXO */
  function flow(e, o) {
    o = o || {};
    const el = inicia(e, 'flow', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const st = o.steps || [], k = st.length, hi = hiDe(o), numeros = o.numeros !== false;
    const cel = 30, pad = 18, m = 1;
    const mp = (campo, peso, tam) => maiorPalavra(st.map(t => t[campo]), LAB, peso, tam);
    const box0 = (W - m * 2 - cel * (k - 1)) / Math.max(1, k);
    const cabeLado = box0 - pad * 2 >= mp('label', 600, 15);
    const vert = k > 1 && ((W < 560 && k > 2) || box0 < 130 || !cabeLado);
    const boxW = vert ? W - m * 2 : box0;
    const tw = boxW - pad * 2;
    const fl = mp('label', 600, 17) <= tw ? 17 : 15;
    const fsb = mp('sub', 400, 15) <= tw ? 15 : 13;
    const lhL = fl * 1.28, lhS = fsb * 1.4;
    const numH = numeros ? 34 : 0;
    const blocos = st.map(t => {
      const Lq = quebra(t.label || '', LAB, 600, fl, tw, 3);
      const S = t.sub ? quebra(t.sub, LAB, 400, fsb, tw, 4) : [];
      return { L: Lq, S, th: Lq.length * lhL + (S.length ? 6 + S.length * lhS : 0) };
    });
    const maxTh = Math.max(0, ...blocos.map(b => b.th));
    const boxH = pad + numH + maxTh + pad;
    const H = vert ? k * boxH + (k - 1) * cel + m * 2 : boxH + m * 2;
    let s = '';
    st.forEach((t, i) => {
      const ehHi = i === hi;
      const x = vert ? m : m + i * (boxW + cel), y = vert ? m + i * (boxH + cel) : m;
      s += `<g data-a="f"><rect x="${r2(x)}" y="${r2(y)}" width="${r2(boxW)}" height="${r2(boxH)}" rx="10" fill="${ehHi ? c.sup : 'none'}" stroke="${ehHi ? c.foco : c.fio}" stroke-width="${ehHi ? 1.5 : 1}"/>`;
      if (ehHi) s += R(x, y + 10, 3, boxH - 20, c.foco);
      let ty = y + pad;
      if (numeros) {
        s += T(x + pad, ty + 14, dois(i + 1), MONO, 500, FM, ehHi ? c.focoTxt : c.apoio, 'start', LSM);
        if (ehHi) s += PF(x + boxW - pad - 4, ty + 10, 4, c);
        ty += numH;
      }
      const b = blocos[i];
      b.L.forEach(ln => { ty += lhL; s += T(x + pad, ty - fl * 0.3, ln, LAB, 600, r2(fl), c.texto, 'start'); });
      if (b.S.length) ty += 6;
      b.S.forEach(ln => { ty += lhS; s += T(x + pad, ty - fsb * 0.34, ln, LAB, 400, r2(fsb), c.apoio, 'start'); });
      s += '</g>';
      if (i < k - 1) {
        const est = `fill="none" stroke="${c.apoio}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
        if (vert) {
          const cx = x + boxW / 2, cy = y + boxH + cel / 2;
          s += `<path d="M${r2(cx - 7)},${r2(cy - 3.5)} L${r2(cx)},${r2(cy + 3.5)} L${r2(cx + 7)},${r2(cy - 3.5)}" ${est}/>`;
        } else {
          const cx = x + boxW + cel / 2, cy = y + boxH / 2;
          s += `<path d="M${r2(cx - 3.5)},${r2(cy - 7)} L${r2(cx + 3.5)},${r2(cy)} L${r2(cx - 3.5)},${r2(cy + 7)}" ${est}/>`;
        }
      }
    });
    monta(el, W, H, s, o, c, 'fluxo', !o.fonte);
  }

  /* =========================================================== NÚMERO (número grande) */
  function kpi(e, o) {
    o = o || {};
    const el = inicia(e, 'kpi', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const vl = o.vlabel != null ? String(o.vlabel) : auto(+o.value || 0);
    const un = o.unit ? String(o.unit).toUpperCase() : '';
    const foco = o.highlight === true || o.highlight === 0 || o.foco === true;
    const serie = (o.serie || []).map(v => +v || 0);
    const lado = serie.length > 1 && W >= 520;
    let tam = Math.min(104, Math.max(52, W * 0.2));
    const uw = un ? mede(un, MONO, 500, FM, LSM) + 14 : 0;
    const dispN = (lado ? W * 0.56 : W) - uw - (foco ? 30 : 0);
    let nw = mede(vl, MONO, 500, tam, -tam * 0.03);
    if (nw > dispN) { tam = tam * dispN / nw; nw = dispN; }
    const base = tam * 0.8;
    let s = T(0, base, vl, MONO, 500, r2(tam), c.texto, 'start', r2(-tam * 0.03), ' data-a="f"');
    if (un) s += T(nw + 12, base, un, MONO, 500, FM, c.apoio, 'start', LSM);
    if (foco) s += PF(nw + uw + 18, base - tam * 0.62, Math.max(4, tam * 0.07), c);
    let y = base + 20;
    const fw = Math.max(64, Math.min(nw, W));
    s += R(0, y, Math.min(fw, 96), 3, c.linha ? c.serie : c.texto, ' data-a="x"');
    y += 4;
    const larguraTxt = lado ? W * 0.56 : W;
    if (o.label) {
      const ls = quebra(o.label, LAB, 600, 18, larguraTxt, 3);
      ls.forEach((ln, k) => { s += T(0, y + 28 + k * 24, ln, LAB, 600, 18, c.texto, 'start'); });
      y += 28 + (ls.length - 1) * 24 + 6;
    }
    if (o.sub) {
      const ls = quebra(o.sub, LAB, 400, 15, larguraTxt, 3);
      ls.forEach((ln, k) => { s += T(0, y + 20 + k * 20, ln, LAB, 400, 15, c.apoio, 'start'); });
      y += 20 + (ls.length - 1) * 20 + 6;
    }
    if (serie.length > 1) {
      const sx = lado ? W * 0.64 : 0, sw = lado ? W - sx - 10 : W - 10;
      const sy = lado ? 10 : y + 22, sh = lado ? Math.max(40, base - 6) : 56;
      const mx = Math.max(...serie), mn = Math.min(...serie), amp = mx - mn || 1;
      const px = i => sx + (i * sw) / (serie.length - 1);
      const py = v => sy + (1 - (v - mn) / amp) * sh;
      const pts = serie.map((v, i) => `${r2(px(i))},${r2(py(v))}`).join(' ');
      s += L(sx, sy + sh + 9.5, sx + sw, sy + sh + 9.5, c.base, 1);
      s += `<polyline points="${pts}" fill="none" stroke="${c.linha ? c.serie : c.apoio}" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round" data-a="d"/>`;
      const u = serie.length - 1;
      s += C(px(u), py(serie[u]), 4.5, c.linha ? c.serie : c.texto, ` stroke="${c.fundo}" stroke-width="2" data-a="p"`);
      if (!lado) y = sy + sh + 16;
    }
    monta(el, W, Math.max(y + 4, lado ? base + tam * 0.3 : 0), s, o, c, 'numero');
  }

  /* =========================================================== LINHA DO TEMPO */
  function timeline(e, o) {
    o = o || {};
    const el = inicia(e, 'timeline', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const ev = o.eventos || [], n = ev.length;
    const hi = hiDe(o);
    if (!n) { monta(el, W, 20, '', o, c, 'linha-tempo'); return; }
    const datas = ev.map(t => String(t.data || '').toUpperCase());
    const colW = W / n;
    const precisa = Math.max(maiorPalavra(ev.map(t => t.label), LAB, 600, 15), ...datas.map(d => mede(d, MONO, 500, FM, LSM))) + 18;
    const horizontal = n > 1 && colW >= Math.max(128, precisa);
    const ref = hi >= 0 ? hi : n - 1;
    const corT = c.linha ? c.serie : c.texto;
    /* o agora: ponto de foco; o que passou: ponto cheio; o que falta: contorno */
    const ponto = (x, y, i) => {
      if (i === hi) return C(x, y, 13, c.foco, ' fill-opacity=".18" data-a="p"') + C(x, y, 6.5, c.foco, ' data-a="p"');
      if (i <= ref) return C(x, y, 4.5, corT, ' data-a="p"');
      return `<circle cx="${r2(x)}" cy="${r2(y)}" r="4.5" fill="${c.fundo}" stroke="${c.apoio}" stroke-width="1.5" data-a="p"/>`;
    };
    let s = '', H = 0;
    if (horizontal) {
      const eixo = 42, x0 = 14, xh = x0 + ref * colW;
      s += L(x0, eixo, Math.min(W, xh), eixo, corT, 2);
      if (ref < n - 1) s += L(xh, eixo, W, eixo, c.base, 1, ' stroke-dasharray="3 4" data-a="x"');
      let fundo = 0;
      ev.forEach((t, i) => {
        const x = i * colW, ehHi = i === hi, tw = colW - 20;
        s += T(x, 16, datas[i], MONO, 500, FM, ehHi ? c.focoTxt : c.apoio, 'start', LSM);
        s += ponto(x + x0, eixo, i);
        let y = eixo + 36;
        quebra(t.label || '', LAB, 600, 15, tw, 3).forEach(ln => { s += T(x, y, ln, LAB, 600, 15, c.texto, 'start'); y += 20; });
        if (t.sub) { y += 2; quebra(t.sub, LAB, 400, FS, tw, 4).forEach(ln => { s += T(x, y, ln, LAB, 400, FS, c.apoio, 'start'); y += 19; }); }
        fundo = Math.max(fundo, y);
      });
      H = fundo - 8;
    } else {
      const x0 = 14, tx = 40, tw = W - tx;
      let y = 8;
      const centros = [];
      let partes = '';
      ev.forEach((t, i) => {
        const ehHi = i === hi;
        centros.push(y + 7);
        partes += T(tx, y + 12, datas[i], MONO, 500, FM, ehHi ? c.focoTxt : c.apoio, 'start', LSM);
        let yy = y + 12 + 23;
        quebra(t.label || '', LAB, 600, 15, tw, 3).forEach(ln => { partes += T(tx, yy, ln, LAB, 600, 15, c.texto, 'start'); yy += 20; });
        if (t.sub) { yy += 2; quebra(t.sub, LAB, 400, FS, tw, 5).forEach(ln => { partes += T(tx, yy, ln, LAB, 400, FS, c.apoio, 'start'); yy += 19; }); }
        y = yy + 14;
      });
      const yh = centros[Math.max(0, Math.min(n - 1, ref))];
      s += L(x0, centros[0], x0, yh, corT, 2);
      if (ref < n - 1) s += L(x0, yh, x0, centros[n - 1], c.base, 1, ' stroke-dasharray="3 4" data-a="f"');
      ev.forEach((t, i) => { s += ponto(x0, centros[i], i); });
      s += partes;
      H = y - 14;
    }
    monta(el, W, Math.max(40, H), s, o, c, 'linha-tempo');
  }

  /* =========================================================== COTA */
  function cota(e, o) {
    o = o || {};
    const el = inicia(e, 'cota', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o), H = 26, cy = 13;
    const lab = String(o.label || '').toUpperCase();
    const tw = mede(lab, MONO, 500, FM, LSM);
    const a = W / 2 - tw / 2 - 10, b = W / 2 + tw / 2 + 10;
    let s = L(0.5, cy, a, cy, c.apoio, 1) + L(b, cy, W - 0.5, cy, c.apoio, 1);
    s += L(0.5, cy - 6, 0.5, cy + 6, c.apoio, 1) + L(W - 0.5, cy - 6, W - 0.5, cy + 6, c.apoio, 1);
    s += T(W / 2 + LSM / 2, cy + 4.5, lab, MONO, 500, FM, c.apoio, 'middle', LSM);
    o = Object.assign({ aria: lab || 'Cota', animar: false }, o);
    monta(el, W, H, s, o, c, 'cota', true);
  }

  /* =========================================================== BOWTIE (M1 a M8) */
  const BOWTIE = ['Lead', 'MQL', 'SQL', 'SAL', 'Assinado', 'Ativo', 'Impacto', 'Expansão'];
  /* alturas das 9 bordas: M1–M4 afunilam, M5 é o nó, M6–M8 abrem */
  const PERFIL = [1, 0.8, 0.62, 0.46, 0.3, 0.3, 0.5, 0.72, 0.94];
  function bowtie(e, o) {
    o = o || {};
    const el = inicia(e, 'bowtie', o); if (!el) return;
    const c = cores(el, o), W = largura(el, o);
    const et = (o.stages && o.stages.length ? o.stages : BOWTIE).map(t => (typeof t === 'object' ? String(t.label || '') : String(t)));
    const n = et.length;
    const vals = (o.values || []).map(v => +v || 0);
    const vls = vals.length ? rotulos(vals, o.vlabels) : [];
    const g = o.gargalo != null ? +o.gargalo : hiDe(o);
    const lados = o.lados === false ? null : (o.lados || ['Antes da venda', 'Depois da venda']);
    const codigo = i => 'M' + (i + 1);
    /* taxa de passagem: lista pronta ou calculada dos valores */
    const taxa = i => {
      if (Array.isArray(o.taxas)) return o.taxas[i] != null ? String(o.taxas[i]) : '';
      if (o.taxas && vals.length > i + 1 && vals[i] > 0) return Math.round(vals[i + 1] / vals[i] * 100) + '%';
      return '';
    };
    const corB = i => (i === g ? c.foco : c.serie);
    const perfil = i => PERFIL[Math.min(PERFIL.length - 1, Math.round(i * (PERFIL.length - 1) / n))];
    let s = '', H;
    const deitado = W >= 560 && o.vertical !== true;
    if (deitado) {
      const cw = W / n, gap = 3;
      const topoT = lados ? 26 : 0;
      const tagH = g >= 0 ? 30 : 0;
      const alt = o.h || Math.min(200, Math.max(120, W * 0.18));
      const y0 = topoT + tagH, cy = y0 + alt / 2;
      if (lados) {
        const meio = cw * 4;
        s += T(0, 13, String(lados[0]).toUpperCase(), MONO, 500, 11, c.apoio, 'start', 1.4);
        s += L(0, 21.5, meio - 10, 21.5, c.fio, 1);
        s += T(W, 13, String(lados[1]).toUpperCase(), MONO, 500, 11, c.apoio, 'end', 1.4);
        s += L(meio + cw + 10, 21.5, W, 21.5, c.fio, 1);
      }
      for (let i = 0; i < n; i++) {
        const xa = i * cw + (i ? gap / 2 : 0), xb = (i + 1) * cw - (i < n - 1 ? gap / 2 : 0);
        const ha = perfil(i) * alt, hb = perfil(i + 1) * alt;
        s += `<path d="M${r2(xa)},${r2(cy - ha / 2)} L${r2(xb)},${r2(cy - hb / 2)} L${r2(xb)},${r2(cy + hb / 2)} L${r2(xa)},${r2(cy + ha / 2)} Z" fill="${corB(i)}" data-a="f"/>`;
        if (i === g) {
          const xm = (xa + xb) / 2, tag = 'GARGALO';
          s += T(xm + 7, y0 - 12, tag, MONO, 500, 11, c.focoTxt, 'middle', 1.4);
          s += PF(xm - mede(tag, MONO, 500, 11, 1.4) / 2 - 2, y0 - 16, 3.5, c);
        }
        if (i < n - 1) {
          const t = taxa(i);
          if (t) {
            const tw = mede(t, MONO, 500, 12) + 10, xt = (i + 1) * cw, yt = cy - perfil(i + 1) * alt / 2 - 14;
            s += R(xt - tw / 2, yt - 11, tw, 16, c.fundo, ' rx="3"') + T(xt, yt + 1, t, MONO, 500, 12, c.apoio, 'middle');
          }
        }
      }
      let y = y0 + alt + 24;
      const fsN = cw < 92 ? 13 : 15;
      let maxY = y;
      for (let i = 0; i < n; i++) {
        const xm = i * cw + cw / 2, ehG = i === g;
        let yy = y;
        s += T(xm, yy, codigo(i), MONO, 500, FM, ehG ? c.focoTxt : c.apoio, 'middle', 1);
        yy += 20;
        quebra(et[i], LAB, 600, fsN, cw - 6, 2).forEach(ln => { s += T(xm, yy, ln, LAB, 600, fsN, c.texto, 'middle'); yy += fsN + 3; });
        if (vls[i] != null) { yy += 3; s += T(xm, yy, vls[i], MONO, 500, ehG ? 15 : 13, ehG ? c.texto : c.apoio, 'middle'); yy += 16; }
        maxY = Math.max(maxY, yy);
      }
      H = maxY - 4;
    } else {
      /* em pé: uma etapa por linha; a gravata fica no meio, rótulos à esquerda, valores à direita */
      const rowH = 44, gap = 3;
      const valW = vls.length ? Math.max(...vls.map(v => mede(v, MONO, 500, 14))) + 6 : 0;
      const labW = Math.min(W * 0.42, Math.max(...et.map(t => mede(t, LAB, 600, 15))) + 8);
      const x0 = labW + 10, x1 = W - (valW ? valW + 10 : 0);
      const larg = x1 - x0, cx = x0 + larg / 2;
      let y = 0;
      if (lados) { s += T(0, 12, String(lados[0]).toUpperCase(), MONO, 500, 11, c.apoio, 'start', 1.4); y = 22; }
      for (let i = 0; i < n; i++) {
        if (lados && i === 5) { s += T(0, y + 14, String(lados[1]).toUpperCase(), MONO, 500, 11, c.apoio, 'start', 1.4); y += 24; }
        const ya = y + (i ? gap / 2 : 0), yb = y + rowH - gap / 2;
        const wa = perfil(i) * larg, wb = perfil(i + 1) * larg;
        s += `<path d="M${r2(cx - wa / 2)},${r2(ya)} L${r2(cx + wa / 2)},${r2(ya)} L${r2(cx + wb / 2)},${r2(yb)} L${r2(cx - wb / 2)},${r2(yb)} Z" fill="${corB(i)}" data-a="f"/>`;
        const ehG = i === g, ym = y + rowH / 2;
        s += T(0, ym - 3, codigo(i) + (ehG ? ' · GARGALO' : ''), MONO, 500, 11, ehG ? c.focoTxt : c.apoio, 'start', 1);
        s += T(0, ym + 14, et[i], LAB, 600, cabeEm(et[i], LAB, 600, 15, 12, labW - 4), c.texto, 'start');
        if (vls[i] != null) s += T(W, ym + 5, vls[i], MONO, 500, 14, ehG ? c.texto : c.apoio, 'end');
        y += rowH;
      }
      H = y;
    }
    o.desc = o.desc || et.map((t, i) => codigo(i) + ' ' + t + (vls[i] != null ? ': ' + vls[i] : '') + (i === g ? ' (gargalo)' : '')).join('; ') + '.';
    monta(el, W, H, s, o, c, 'bowtie');
  }

  /* =========================================================== montagem e nomes */
  const tipos = { bars, hbars, line, share, ring, funnel, flow, kpi, timeline, cota, bowtie };
  const TIPO = { barras: 'bars', 'barras-h': 'hbars', ranking: 'hbars', linha: 'line', composicao: 'share', 'composição': 'share',
    anel: 'ring', funil: 'funnel', fluxo: 'flow', numero: 'kpi', 'número': 'kpi', 'linha-tempo': 'timeline', 'linha-do-tempo': 'timeline',
    cota: 'cota', bowtie: 'bowtie', gravata: 'bowtie' };
  const CHAVE = { rotulos: 'labels', valores: 'values', valores2: 'values2', vrotulos: 'vlabels', destaque: 'highlight', unidade: 'unit', altura: 'h', largura: 'w',
    etapas: 'stages', segmentos: 'segments', passos: 'steps', rotulo: 'label', valor: 'value', vrotulo: 'vlabel', tamanho: 's', events: 'eventos', overline: 'sobretitulo', title: 'titulo', source: 'fonte', date: 'data', field: 'campo' };
  function normaliza(o) {
    if (Array.isArray(o)) return o.map(x => normaliza(x));
    if (!o || typeof o !== 'object') return o;
    const r = {};
    Object.keys(o).forEach(k => { r[CHAVE[k] || k] = normaliza(o[k]); });
    return r;
  }
  function render(el, tipo, opts) {
    const k = TIPO[tipo] || tipo, f = tipos[k];
    const o = Object.assign({}, opts || {}); o.tipo = tipo;
    if (f) f(el, normaliza(o));
    else if (typeof console !== 'undefined') console.error('gviz: tipo desconhecido "' + tipo + '". Tipos: ' + api.tipos.join(', '));
  }
  function montar(raiz) {
    if (!temDoc) return;
    (raiz || document).querySelectorAll('[data-gviz]').forEach(el => {
      if (el.__gvizMontado || el.tagName.toLowerCase() === 'svg') return;
      let cfg;
      try { cfg = JSON.parse(el.getAttribute('data-gviz')); } catch (err) { console.error('gviz: data-gviz não é JSON válido', el); return; }
      el.__gvizMontado = 1;
      render(el, cfg.tipo, cfg);
    });
  }
  function redesenhar() {
    registro.forEach(el => {
      if (!el.isConnected) { registro.delete(el); return; }
      const c = el.__gviz;
      if (c && tipos[c.tipo]) tipos[c.tipo](el, c.opts);
    });
  }
  function svg(e, opts) {
    if (typeof e === 'string' && (TIPO[e] || tipos[e]) && temDoc && document.body) {
      const o = Object.assign({ campo: 'dia', animar: false }, opts || {});
      const W = +(o.largura || o.w) || 960;
      const caixa = document.createElement('div');
      caixa.setAttribute('aria-hidden', 'true');
      caixa.style.cssText = `position:absolute;left:-99999px;top:0;width:${W}px;visibility:hidden`;
      document.body.appendChild(caixa);
      o.largura = W;
      render(caixa, e, o);
      registro.delete(caixa);
      const s = caixa.querySelector('svg');
      let out = '';
      if (s) out = exporta(s, 'gvx' + (++seqX));
      if (ro) try { ro.unobserve(caixa); } catch (err) { /* ok */ }
      caixa.remove();
      return out;
    }
    const el = alvo(e);
    const s = el && (el.tagName && el.tagName.toLowerCase() === 'svg' ? el : el.querySelector('svg'));
    return s ? exporta(s.cloneNode(true), 'gvx' + (++seqX)) : '';
  }
  /* SVG para arquivo: width/height reais, fundo do campo, sem marcas de animação */
  function exporta(s, novo) {
    const vb = s.getAttribute('viewBox').split(' ').map(Number);
    const antigo = s.id;
    s.setAttribute('width', Math.round(vb[2])); s.setAttribute('height', Math.round(vb[3]));
    s.removeAttribute('style');
    s.id = novo;
    return s.outerHTML.replace(/ data-a="[a-z]+"/g, '').replace(/ style="transform[^"]*"/g, '').split(antigo + '-').join(novo + '-');
  }
  let ro = null, espera = 0;
  const larguras = new WeakMap();
  function observa(el) {
    if (!ro && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(entradas => {
        let mudou = false;
        entradas.forEach(en => {
          const w = Math.round(en.contentRect.width);
          if (larguras.get(en.target) !== w) { larguras.set(en.target, w); mudou = true; }
        });
        if (!mudou) return;
        clearTimeout(espera);
        espera = setTimeout(redesenhar, 120);
      });
    }
    if (ro && !larguras.has(el)) { larguras.set(el, Math.round(el.clientWidth || 0)); ro.observe(el); }
  }
  const nomeado = k => (e, o) => render(e, k, o);
  const api = { barras: nomeado('barras'), ranking: nomeado('ranking'), linha: nomeado('linha'), composicao: nomeado('composicao'),
    anel: nomeado('anel'), funil: nomeado('funil'), fluxo: nomeado('fluxo'), numero: nomeado('numero'), linhaTempo: nomeado('linha-tempo'),
    cota: nomeado('cota'), bowtie: nomeado('bowtie'),
    tipos: ['barras', 'ranking', 'linha', 'composicao', 'anel', 'funil', 'fluxo', 'numero', 'linha-tempo', 'cota', 'bowtie'],
    etapasBowtie: BOWTIE.slice(), fmt, render, montar, redesenhar, svg, paletas: PALETAS, linhas: LINHAS, contraste, animar: true, version: '3.0' };
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeprint', () => { terminaAnimacoes(); redesenhar(); });
    try {
      if (temDoc && document.fonts) {
        const recarrega = () => { cache.clear(); redesenhar(); };
        document.fonts.ready.then(recarrega);
        document.fonts.addEventListener('loadingdone', recarrega);
      }
    } catch (err) { /* sem API de fontes */ }
    if (temDoc) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => montar());
      else montar();
    }
  }
  return api;
})();
if (typeof window !== 'undefined') window.gviz = gviz;
