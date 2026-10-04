/* =====================================================================
   GFORMS · formas da GrowAI · sistema Radar de Foco v4 (tipografia Editorial)
   Quando uma peça precisa de uma FORMA (o Radar, anéis, o ponto de foco, a grade de
   pontos, o caminho das 3 linhas, o ciclo do gargalo, o ponteiro, o cartão de aviso),
   ela sai daqui: nunca de banco de imagem, de emoji ou de desenho feito na hora.

   De onde vêm as formas
   · Do "g" do logo lido como radar: o anel é a tela do radar, a haste é a varredura,
     o ponto encontrado é o FOCO. Uma composição tem UM ponto laranja (#FF6A1A).
   · Nenhuma forma redesenha o logo. Quando a peça precisa da marca, ela é sempre o
     arquivo de assets/ (growai-logo-*.svg, growai-simbolo-*.svg).

   Regras do motor
   · JavaScript ES2015 simples, zero dependências. SVG puro para as formas paradas;
     <canvas> só para o radar animado. Determinístico: os pontos do radar saem de um
     gerador com semente (mesma semente, mesmo desenho), sem Math.random.
   · Campo: lê a cor de fundo real atrás da forma (escuro = Noite, claro = Dia) ou usa
     "campo":"noite"|"dia". Noite: fundo #0B0D12, texto #EEF1F5, apoio #9AA3B2,
     linha #232936. Dia: fundo #FFFFFF, texto #0C0F14, apoio #4A525E, linha #E4E7EB.
   · "linha":"educacao"|"strategy"|"agentes" pinta o traço principal com a cor da linha.
     Laranja só no ponto de foco (e na borda do cartão de aviso).
   · Movimento: só o radar e o ponto (com pulso) se mexem. Em prefers-reduced-motion,
     na impressão e em navegador automatizado, ficam parados no quadro final (ponto
     aceso, aviso visível). Fora da tela o radar pausa (IntersectionObserver).
   · Acessibilidade: com "aria" a forma ganha role="img" e <title>; sem isso é
     decorativa (aria-hidden). O aviso do radar é texto HTML de verdade (legível por
     leitor de tela quando "aria" é passado).

   Como usar
     <div data-gforms="radar" data-gforms-opts='{"aviso":{"rotulo":"Gargalo encontrado",
          "texto":"Propostas paradas há 9 dias concentram 62% da receita em aberto."}}'></div>
     <div data-gforms="ciclo"></div>
     <div data-gforms='{"forma":"ponteiro","valor":38,"zona":[60,85]}'></div>  (JSON também vale)
     gforms.radar(el, opts) · gforms.render(el, nome, opts) · gforms.montar(raiz)
     gforms.redesenhar() · gforms.svg(nome, opts): SVG pronto (texto) para salvar ou levar
     ao Canva (o radar animado exporta como radar-svg). gforms.parar() / gforms.seguir()
     param e retomam todos os radares.

   As formas
     radar      canvas animado: anéis, eixos, pontos que acendem quando a varredura passa e
                apagam devagar, UM ponto de foco laranja que acende quando a varredura o
                encontra e fica com pulso. Varredura fixa: 1 volta a cada 6 s.
                Opções: pontos (padrão 64), semente (7), foco {angulo (graus, 0 = direita,
                sentido horário; padrão -54), raio (0–1; padrão .56)}, aviso {rotulo, texto},
                leitura [{rotulo, valor}] (leitura em mono no canto), campo, aria.
                O contêiner vira quadrado (aspect-ratio 1) se não tiver altura.
     radar-svg  o mesmo radar, parado, em SVG (impresso, slide, Canva). Mesmas opções; o aviso
                sai dentro do SVG como cartão. Opção varredura (true) mostra o rastro parado.
     aneis      anéis concêntricos discretos. Opções: n (4), eixos (false), foco (true ou
                {angulo, raio}) para um ponto laranja num anel, tamanho.
     ponto      o ponto de foco com halo. Opções: tamanho (48), pulso (false: halo pulsando,
                só com movimento permitido).
     grade      textura de pontos discreta. Opções: espaco (24), raio (1.4), proporcao
                ('16/9' quando o contêiner não tem altura), desvanecer (true: some nas bordas),
                foco {x, y} (0–1) para acender um ponto laranja.
     caminho    os 3 trechos aprender → organizar → escalar nas cores das linhas (Framboesa,
                Cobalto, Verde Pulso). Opções: atual (índice 0–2: ponto de foco "você está
                aqui"), descricao (true), trechos [{rotulo, nome, texto}] para trocar os textos.
                Largo: deitado; estreito (< 600): em pé.
     ciclo      Medir → Diagnosticar → Focar → Destravar → Escalar, em círculo, o Focar em
                laranja. Opções: etapas (5 nomes), foco (índice; padrão 2), centro (texto do
                meio; padrão "Um gargalo por vez"; false tira).
     ponteiro   medidor semicircular com agulha e zona alvo. Opções: valor (0–100), vrotulo,
                rotulo, zona [de, ate] (0–100), extremos ['0%','100%'], rotuloZona ('Meta').
                A ponta da agulha é o ponto de foco.
     sinal      cartão de aviso: rótulo mono, texto, borda esquerda laranja. Opções: rotulo,
                texto, largura (máximo; padrão 420).
   ===================================================================== */
const gforms = (() => {
  'use strict';
  let seq = 0, seqX = 0;
  const temDoc = typeof document !== 'undefined';
  const registro = new Set();
  const el$ = e => (typeof e === 'string' ? (temDoc ? document.getElementById(e) : null) : e);
  const f = v => (Math.round(v * 100) / 100).toString();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const nomes = ['radar', 'radar-svg', 'aneis', 'ponto', 'grade', 'caminho', 'ciclo', 'ponteiro', 'sinal'];
  const APELIDO = { 'anéis': 'aneis', anel: 'aneis', radarsvg: 'radar-svg', 'radar-estatico': 'radar-svg', medidor: 'ponteiro', aviso: 'sinal', foco: 'ponto', pontos: 'grade', trilha: 'caminho' };
  const FOCO = '#FF6A1A';
  const TAU = Math.PI * 2;

  /* ---------- paletas ---------- */
  const PALETAS = {
    noite: { fundo: '#0B0D12', sup: '#141821', fio: '#232936', texto: '#EEF1F5', apoio: '#9AA3B2', focoTxt: '#FF8A4C' },
    dia: { fundo: '#FFFFFF', sup: '#F6F7F8', fio: '#E4E7EB', texto: '#0C0F14', apoio: '#4A525E', focoTxt: '#B33E0A' }
  };
  const LINHAS = {
    educacao: { nome: 'Educação', papel: 'aprender', dia: '#D63A7A', diaTxt: '#A82259', noite: '#FF8DB8' },
    strategy: { nome: 'Strategy', papel: 'organizar', dia: '#2F5BEA', diaTxt: '#1E3FB8', noite: '#8FA8FF' },
    agentes: { nome: 'Agentes', papel: 'escalar', dia: '#12A877', diaTxt: '#0B7A56', noite: '#3DDC9F' }
  };
  const ORDEM = ['educacao', 'strategy', 'agentes'];
  const LINHA_ALIAS = { 'educação': 'educacao', edu: 'educacao', str: 'strategy', age: 'agentes', agente: 'agentes' };
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
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgba = (h, a) => { const p = rgb(h); return `rgba(${p[0]},${p[1]},${p[2]},${a})`; };
  function mistura(a, b, t) {
    const x = rgb(a), y = rgb(b);
    return '#' + x.map((v, i) => ('0' + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2)).join('').toUpperCase();
  }
  function luz(h) {
    const c = rgb(h).map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const contraste = (a, b) => { const x = luz(a), y = luz(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
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
  const nomeLinha = l => { l = String(l || '').toLowerCase(); return LINHAS[l] ? l : (LINHA_ALIAS[l] || null); };
  function completa(c, o) {
    c.escuro = luz(c.fundo) < 0.2;
    c.foco = FOCO;
    const ln = nomeLinha(o && o.linha);
    c.linha = ln;
    c.traco = ln ? (c.escuro ? LINHAS[ln].noite : LINHAS[ln].dia) : c.texto;
    c.tracoTxt = ln ? (c.escuro ? LINHAS[ln].noite : LINHAS[ln].diaTxt) : c.apoio;
    c.cor = k => (c.escuro ? LINHAS[k].noite : LINHAS[k].dia);
    c.corTxt = k => (c.escuro ? LINHAS[k].noite : LINHAS[k].diaTxt);
    if (contraste(c.apoio, c.fundo) < 4.5) c.apoio = mistura(c.apoio, c.texto, 0.4);
    return c;
  }
  function cores(el, o) {
    if (o && o.campo && PALETAS[o.campo]) return completa(Object.assign({}, PALETAS[o.campo]), o);
    const real = el ? fundoReal(el) : null;
    if (!real) return completa(Object.assign({}, PALETAS.dia), o);
    return completa(Object.assign({}, luz(real) < 0.2 ? PALETAS.noite : PALETAS.dia, { fundo: real }), o);
  }

  /* ---------- texto: medida e quebra ---------- */
  /* tipografia v4: Newsreader (títulos), Hanken Grotesk (texto), IBM Plex Mono (rótulos) */
  const TIT = "font-family:'Newsreader',Georgia,'Times New Roman',serif;font-optical-sizing:auto";
  const TITI = TIT + ";font-style:italic";
  const LAB = "font-family:'Hanken Grotesk',Arial,Helvetica,system-ui,sans-serif";
  const MONO = "font-family:'IBM Plex Mono','Courier New',ui-monospace,Menlo,monospace";
  const estilo = (fam, peso, tam, ls) => `${fam};font-weight:${peso};font-size:${f(tam)}px` + (ls ? `;letter-spacing:${f(ls)}px` : '');
  const T = (x, y, txt, fam, peso, tam, cor, anc, ls) => `<text x="${f(x)}" y="${f(y)}"${anc && anc !== 'start' ? ` text-anchor="${anc}"` : ''} fill="${cor}" style="${estilo(fam, peso, tam, ls)}">${esc(txt)}</text>`;
  const C = (cx, cy, r, fill, extra) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${extra || ''}/>`;
  const PF = (cx, cy, r, extra) => C(cx, cy, r * 2.2, FOCO, ' fill-opacity=".18"') + C(cx, cy, r, FOCO, extra || '');
  const cacheTxt = new Map();
  let medidor = null;
  function mede(txt, fam, peso, tam, ls) {
    txt = String(txt);
    const k = fam.length + '|' + peso + '|' + tam + '|' + (ls || 0) + '|' + txt;
    if (cacheTxt.has(k)) return cacheTxt.get(k);
    let w = 0;
    try {
      if (temDoc && document.body) {
        if (!medidor || !medidor.isConnected) {
          const NS = 'http://www.w3.org/2000/svg';
          medidor = document.createElementNS(NS, 'svg');
          medidor.setAttribute('aria-hidden', 'true');
          medidor.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none';
          medidor.appendChild(document.createElementNS(NS, 'text'));
          document.body.appendChild(medidor);
        }
        const t = medidor.firstChild;
        t.setAttribute('style', estilo(fam, peso, tam, ls));
        t.textContent = txt;
        w = t.getComputedTextLength();
      }
    } catch (err) { w = 0; }
    if (!w) w = txt.length * (fam === MONO ? 0.6 : (fam.indexOf('Newsreader') > 0 ? 0.47 : 0.53)) * tam + (ls || 0) * txt.length;
    cacheTxt.set(k, w);
    return w;
  }
  function quebra(txt, fam, peso, tam, maxW, maxL, ls) {
    const pal = String(txt).split(/\s+/).filter(Boolean);
    if (!pal.length) return [];
    const linhas = [];
    let atual = pal[0];
    for (let i = 1; i < pal.length; i++) {
      const tenta = atual + ' ' + pal[i];
      if (mede(tenta, fam, peso, tam, ls) <= maxW) atual = tenta; else { linhas.push(atual); atual = pal[i]; }
    }
    linhas.push(atual);
    if (maxL && linhas.length > maxL) { const cab = linhas.slice(0, maxL - 1); cab.push(linhas.slice(maxL - 1).join(' ')); return cab; }
    return linhas;
  }

  /* ---------- movimento ---------- */
  function semMovimento() {
    try {
      if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
      return !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('print').matches;
    } catch (err) { return true; }
  }
  /* gerador com semente (Park–Miller): mesmos pontos sempre */
  function gerador(semente) { let s = (Math.abs(Math.floor(+semente || 7)) % 2147483646) + 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  const normA = v => { v %= TAU; return v < 0 ? v + TAU : v; };
  function geometria(o) {
    const rnd = gerador(o.semente == null ? 7 : o.semente);
    const n = Math.max(0, Math.min(200, o.pontos == null ? 64 : +o.pontos));
    const pts = [];
    for (let i = 0; i < n; i++) { const a = rnd() * TAU, r = 0.14 + rnd() * 0.8; pts.push({ a, r, hit: 0 }); }
    const fo = o.foco === false ? null : Object.assign({ angulo: -54, raio: 0.56 }, typeof o.foco === 'object' ? o.foco : {});
    /* nenhum ponto comum colado no foco */
    const alvoF = fo ? { a: normA(fo.angulo * Math.PI / 180), r: Math.max(0.1, Math.min(0.9, +fo.raio)) } : null;
    const livres = alvoF ? pts.filter(p => { const dx = Math.cos(p.a) * p.r - Math.cos(alvoF.a) * alvoF.r, dy = Math.sin(p.a) * p.r - Math.sin(alvoF.a) * alvoF.r; return Math.sqrt(dx * dx + dy * dy) > 0.09; }) : pts;
    return { pts: livres, alvo: alvoF };
  }
  /* rastro da varredura: quão "aceso" um ponto fica dado o ângulo da varredura (quadro parado) */
  const brilhoParado = (sweep, a) => { const d = normA(sweep - a); return d < 2.2 ? Math.max(0, 1 - d / 2.2) : 0; };

  /* =========================================================== RADAR ANIMADO (canvas) */
  const VOLTA_MS = 6000;
  const radares = new Set();
  let ioRadar = null;
  function radarCanvas(t, o) {
    if (t.__rd) { pararRadar(t); }
    const c = cores(t, o);
    t.innerHTML = '';
    try { if (getComputedStyle(t).position === 'static') t.style.position = 'relative'; } catch (err) { /* ok */ }
    if (!t.style.aspectRatio && !(t.clientHeight > 8)) t.style.aspectRatio = '1 / 1';
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    cv.setAttribute('aria-hidden', 'true');
    t.appendChild(cv);
    if (o.aria) { t.setAttribute('role', 'img'); t.setAttribute('aria-label', o.aria); } else t.setAttribute('aria-hidden', 'true');
    let aviso = null;
    if (o.aviso && (o.aviso.texto || o.aviso.rotulo)) {
      aviso = document.createElement('div');
      aviso.className = 'gforms-aviso';
      aviso.innerHTML = (o.aviso.rotulo ? `<b>${esc(o.aviso.rotulo)}</b>` : '') + esc(o.aviso.texto || '');
      t.appendChild(aviso);
    }
    let leitura = null;
    if (Array.isArray(o.leitura) && o.leitura.length) {
      leitura = document.createElement('div');
      leitura.innerHTML = o.leitura.map(l => `<span>${esc(l.rotulo || '')} <b${l.foco ? ` style="color:${c.escuro ? '#FF8A4C' : '#B33E0A'}"` : ''}>${esc(l.valor == null ? '' : l.valor)}</b></span>`).join('');
      t.appendChild(leitura);
    }
    const g = geometria(o);
    const st = { cv, ctx: cv.getContext('2d'), c, o, g, aviso, leitura, ang: g.alvo ? g.alvo.a - 2.4 : -2.4, achou: false, ultimo: 0, raf: 0, visivel: true, tam: 0, dpr: 1 };
    t.__rd = st;
    estiloOverlay(t, st);
    dimensiona(t);
    radares.add(t);
    if (typeof IntersectionObserver !== 'undefined') {
      if (!ioRadar) ioRadar = new IntersectionObserver(es => es.forEach(en => { const s = en.target.__rd; if (!s) return; s.visivel = en.isIntersecting; if (s.visivel) liga(en.target); }), { threshold: 0 });
      ioRadar.observe(t);
    }
    liga(t);
  }
  function estiloOverlay(t, st) {
    const c = st.c, w = t.clientWidth || 320;
    if (st.aviso) {
      const a = st.aviso, estreito = w < 380;
      const fx = st.g.alvo ? 0.5 + Math.cos(st.g.alvo.a) * st.g.alvo.r * 0.46 : 0.7;
      const fy = st.g.alvo ? 0.5 + Math.sin(st.g.alvo.a) * st.g.alvo.r * 0.46 : 0.3;
      let pos;
      if (estreito) pos = 'left:4%;right:4%;bottom:3%;max-width:none';
      else {
        const lado = fx > 0.55 ? `right:${f((1 - fx) * 100 + 6)}%` : `left:${f(fx * 100 + 6)}%`;
        const alto = fy < 0.5 ? `top:${f(Math.max(2, fy * 100 - 4))}%` : `bottom:${f(Math.max(2, (1 - fy) * 100 - 4))}%`;
        pos = `${lado};${alto};max-width:min(240px,44%)`;
      }
      a.style.cssText = `position:absolute;${pos};background:${c.escuro ? 'rgba(20,24,33,.94)' : 'rgba(255,255,255,.96)'};border:1px solid ${c.fio};border-left:3px solid ${FOCO};border-radius:10px;padding:10px 12px;` +
        `font:400 13px/1.42 'Hanken Grotesk',Arial,system-ui,sans-serif;color:${c.texto};opacity:0;transform:translateY(6px);transition:opacity .5s,transform .5s;pointer-events:none`;
      const b = a.querySelector('b');
      if (b) b.style.cssText = `display:block;font:500 11px/1.4 'IBM Plex Mono','Courier New',ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:${c.focoTxt};margin-bottom:3px`;
      if (semMovimento()) a.style.transition = 'none';
    }
    if (st.leitura) {
      st.leitura.style.cssText = `position:absolute;left:3%;${st.aviso && w < 380 ? 'top:3%' : 'bottom:4%'};display:grid;gap:2px;font:400 11.5px/1.4 'IBM Plex Mono','Courier New',ui-monospace,monospace;color:${c.apoio};pointer-events:none`;
      Array.prototype.forEach.call(st.leitura.querySelectorAll('b'), b => { b.style.fontWeight = '500'; if (!b.style.color) b.style.color = c.texto; });
    }
  }
  function dimensiona(t) {
    const st = t.__rd; if (!st) return;
    const w = Math.max(1, Math.round(t.clientWidth)), h = Math.max(1, Math.round(t.clientHeight || w));
    const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    st.cv.width = Math.round(w * dpr); st.cv.height = Math.round(h * dpr);
    st.tam = Math.min(w, h); st.w = w; st.h = h; st.dpr = dpr;
  }
  function acende(st) { st.achou = true; if (st.aviso) { st.aviso.style.opacity = '1'; st.aviso.style.transform = 'none'; } }
  function liga(t) {
    const st = t.__rd; if (!st) return;
    if (semMovimento() || api.animar === false) { quadroParado(st); return; }
    if (st.raf || !st.visivel) return;
    st.ultimo = 0;
    const passo = agora => {
      st.raf = 0;
      if (!st.visivel || !t.isConnected) return;
      const dt = st.ultimo ? Math.min(64, agora - st.ultimo) : 16;
      st.ultimo = agora;
      quadro(st, dt, agora);
      st.raf = requestAnimationFrame(passo);
    };
    st.raf = requestAnimationFrame(passo);
  }
  function pararRadar(t) { const st = t.__rd; if (st && st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; } }
  function quadroParado(st) {
    if (st.g.alvo) st.ang = st.g.alvo.a + 0.5;
    st.g.pts.forEach(p => { p.hit = brilhoParado(st.ang, p.a) * 0.9; });
    if (st.g.alvo) acende(st);
    desenha(st, 0, true);
  }
  function quadro(st, dt, agora) {
    const antes = st.ang;
    st.ang += dt * TAU / VOLTA_MS;
    const passou = a => normA(a - antes) <= normA(st.ang - antes) && normA(st.ang - antes) < 1;
    st.g.pts.forEach(p => { if (passou(p.a)) p.hit = 1; p.hit = Math.max(0, p.hit - dt * 0.00055); });
    if (st.g.alvo && !st.achou && passou(st.g.alvo.a)) acende(st);
    desenha(st, agora, false);
  }
  function desenha(st, agora, parado) {
    const x = st.ctx, c = st.c, S = st.tam, R = S / 2 * 0.92, k = S / 560;
    x.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    x.clearRect(0, 0, st.w, st.h);
    x.save();
    x.translate(st.w / 2, st.h / 2);
    const tinta = c.escuro ? '#9AA3B2' : '#4A525E';
    x.strokeStyle = rgba(tinta, c.escuro ? 0.18 : 0.16);
    x.lineWidth = Math.max(1, 1 * k);
    for (let i = 1; i <= 4; i++) { x.beginPath(); x.arc(0, 0, R * i / 4, 0, TAU); x.stroke(); }
    x.beginPath(); x.moveTo(-R, 0); x.lineTo(R, 0); x.moveTo(0, -R); x.lineTo(0, R); x.stroke();
    /* rastro da varredura */
    const a = st.ang;
    const fatias = 18;
    for (let i = 0; i < fatias; i++) {
      const a1 = a - 0.9 * (i + 1) / fatias, a0 = a - 0.9 * i / fatias;
      x.fillStyle = rgba(FOCO, (c.escuro ? 0.16 : 0.11) * (1 - i / fatias));
      x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, a1, a0); x.closePath(); x.fill();
    }
    x.strokeStyle = rgba(c.escuro ? '#FF8C50' : FOCO, c.escuro ? 0.55 : 0.5);
    x.lineWidth = Math.max(1, 1.25 * k);
    x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * R, Math.sin(a) * R); x.stroke();
    /* pontos de dado: acendem com a varredura e apagam devagar */
    const apag = c.escuro ? [200, 205, 215] : [110, 118, 130], aces = c.escuro ? [255, 225, 215] : [12, 15, 20];
    st.g.pts.forEach(p => {
      const h = p.hit, px = Math.cos(p.a) * p.r * R, py = Math.sin(p.a) * p.r * R;
      const col = apag.map((v, i) => Math.round(v + (aces[i] - v) * h));
      x.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(c.escuro ? 0.28 : 0.3) + 0.6 * h})`;
      x.beginPath(); x.arc(px, py, (2 + 1.5 * h) * k * 1.0 + 0.5, 0, TAU); x.fill();
    });
    /* o foco: apagado até ser encontrado; depois aceso, com pulso */
    if (st.g.alvo) {
      const tx = Math.cos(st.g.alvo.a) * st.g.alvo.r * R, ty = Math.sin(st.g.alvo.a) * st.g.alvo.r * R;
      if (st.achou) {
        const pulso = parado ? 0.45 : (agora % 1800) / 1800;
        x.strokeStyle = rgba(FOCO, 0.6 * (1 - pulso)); x.lineWidth = Math.max(1, 1.5 * k);
        x.beginPath(); x.arc(tx, ty, (5 + 19 * pulso) * k + 1, 0, TAU); x.stroke();
        x.fillStyle = rgba(FOCO, 0.18); x.beginPath(); x.arc(tx, ty, 10 * k + 1, 0, TAU); x.fill();
        x.fillStyle = FOCO; x.beginPath(); x.arc(tx, ty, 5 * k + 0.5, 0, TAU); x.fill();
      } else {
        x.fillStyle = `rgba(${apag[0]},${apag[1]},${apag[2]},${c.escuro ? 0.28 : 0.3})`;
        x.beginPath(); x.arc(tx, ty, 2 * k + 0.5, 0, TAU); x.fill();
      }
    }
    x.restore();
  }

  /* =========================================================== FORMAS EM SVG
     Cada forma recebe (W, H, c, o, id) e devolve { w, h, s, defs?, fixo? } */
  const formas = {};

  /* ---------- radar-svg ---------- */
  formas['radar-svg'] = (W, H, c, o) => {
    const S = Math.max(200, Math.min(W, o.tamanho || W)), R = S / 2 * 0.92, cx = S / 2, cy = S / 2, k = S / 560;
    const g = geometria(o);
    const ang = g.alvo ? g.alvo.a + 0.5 : -0.6;
    const tinta = c.escuro ? '#9AA3B2' : '#4A525E';
    let s = '';
    for (let i = 1; i <= 4; i++) s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * i / 4)}" fill="none" stroke="${tinta}" stroke-opacity="${c.escuro ? 0.22 : 0.18}" stroke-width="${f(Math.max(1, k))}"/>`;
    s += `<path d="M${f(cx - R)},${f(cy)}H${f(cx + R)}M${f(cx)},${f(cy - R)}V${f(cy + R)}" stroke="${tinta}" stroke-opacity="${c.escuro ? 0.22 : 0.18}" stroke-width="${f(Math.max(1, k))}" fill="none"/>`;
    if (o.varredura !== false) {
      const fatias = 14;
      for (let i = 0; i < fatias; i++) {
        const a1 = ang - 0.9 * (i + 1) / fatias, a0 = ang - 0.9 * i / fatias;
        s += `<path d="M${f(cx)},${f(cy)}L${f(cx + Math.cos(a1) * R)},${f(cy + Math.sin(a1) * R)}A${f(R)},${f(R)} 0 0 1 ${f(cx + Math.cos(a0) * R)},${f(cy + Math.sin(a0) * R)}Z" fill="${FOCO}" fill-opacity="${f((c.escuro ? 0.15 : 0.1) * (1 - i / fatias))}"/>`;
      }
      s += `<line x1="${f(cx)}" y1="${f(cy)}" x2="${f(cx + Math.cos(ang) * R)}" y2="${f(cy + Math.sin(ang) * R)}" stroke="${FOCO}" stroke-opacity=".5" stroke-width="${f(Math.max(1, 1.25 * k))}"/>`;
    }
    const apag = c.escuro ? '#C8CDD7' : '#6E7682', aces = c.escuro ? '#FFE1D7' : '#0C0F14';
    g.pts.forEach(p => {
      const h = brilhoParado(ang, p.a) * 0.9;
      s += C(cx + Math.cos(p.a) * p.r * R, cy + Math.sin(p.a) * p.r * R, (2 + 1.5 * h) * k + 0.5, mistura(apag, aces, h), ` fill-opacity="${f((c.escuro ? 0.28 : 0.3) + 0.6 * h)}"`);
    });
    let fx = 0, fy = 0;
    if (g.alvo) {
      fx = cx + Math.cos(g.alvo.a) * g.alvo.r * R; fy = cy + Math.sin(g.alvo.a) * g.alvo.r * R;
      s += C(fx, fy, 14 * k + 1, 'none', ` stroke="${FOCO}" stroke-opacity=".35" stroke-width="${f(Math.max(1, 1.5 * k))}"`);
      s += PF(fx, fy, 5 * k + 0.5);
    }
    let h = S;
    if (o.aviso && (o.aviso.texto || o.aviso.rotulo)) {
      const card = cartao(c, S < 380 ? S - 8 : Math.min(260, S * 0.5), o.aviso.rotulo, o.aviso.texto, S < 380 ? 14 : 13);
      let ax, ay;
      if (S < 380) { ax = (S - card.w) / 2; ay = S + 12; h = S + 12 + card.h; }
      else {
        ax = fx > cx ? fx - card.w - 22 * k - 10 : fx + 22 * k + 10;
        ay = fy < cy ? fy - 10 : fy - card.h + 10;
        ax = Math.max(4, Math.min(S - card.w - 4, ax)); ay = Math.max(4, Math.min(S - card.h - 4, ay));
      }
      s += `<g transform="translate(${f(ax)} ${f(ay)})">${card.s}</g>`;
    }
    return { w: S, h, s, fixo: true };
  };
  /* o cartão de aviso (usado no sinal e no radar-svg) */
  function cartao(c, maxW, rotulo, texto, tam) {
    tam = tam || 15;
    const pad = Math.round(tam * 0.9), tw = maxW - pad * 2 - 3;
    const lsR = rotulo ? quebra(String(rotulo).toUpperCase(), MONO, 500, 11, tw, 2, 1.1) : [];
    const lsT = texto ? quebra(texto, LAB, 400, tam, tw, 8) : [];
    const larg = Math.min(maxW, Math.max(...lsR.map(l => mede(l, MONO, 500, 11, 1.1)), ...lsT.map(l => mede(l, LAB, 400, tam)), 60) + pad * 2 + 3);
    const lh = tam * 1.38;
    let y = pad, s = '';
    lsR.forEach(l => { y += 13; s += T(pad + 3, y - 2, l, MONO, 500, 11, c.focoTxt, 'start', 1.1); });
    if (lsR.length && lsT.length) y += 5;
    lsT.forEach(l => { y += lh; s += T(pad + 3, y - lh * 0.28, l, LAB, 400, tam, c.texto, 'start'); });
    const h = y + pad;
    const fundo = `<rect x="0" y="0" width="${f(larg)}" height="${f(h)}" rx="10" fill="${FOCO}"/>` +
      `<rect x="3" y=".5" width="${f(larg - 3.5)}" height="${f(h - 1)}" rx="8.5" fill="${c.sup}" stroke="${c.fio}"/>`;
    return { w: larg, h, s: fundo + s };
  }

  /* ---------- aneis ---------- */
  formas.aneis = (W, H, c, o) => {
    const S = Math.max(80, Math.min(W, o.tamanho || W)), cx = S / 2, R = S / 2 - 2, n = Math.max(1, +o.n || 4);
    const tinta = c.escuro ? '#9AA3B2' : '#4A525E';
    let s = '';
    for (let i = 1; i <= n; i++) s += `<circle cx="${f(cx)}" cy="${f(cx)}" r="${f(R * i / n)}" fill="none" stroke="${tinta}" stroke-opacity="${c.escuro ? 0.28 : 0.22}" stroke-width="1"/>`;
    if (o.eixos) s += `<path d="M${f(cx - R)},${f(cx)}H${f(cx + R)}M${f(cx)},${f(cx - R)}V${f(cx + R)}" stroke="${tinta}" stroke-opacity="${c.escuro ? 0.22 : 0.18}" fill="none"/>`;
    if (o.foco) {
      const fo = Object.assign({ angulo: -54, raio: (n - 1) / n }, typeof o.foco === 'object' ? o.foco : {});
      const a = fo.angulo * Math.PI / 180;
      s += PF(cx + Math.cos(a) * fo.raio * R, cx + Math.sin(a) * fo.raio * R, Math.max(3, S / 70));
    }
    return { w: S, h: S, s, fixo: true };
  };

  /* ---------- ponto ---------- */
  formas.ponto = (W, H, c, o) => {
    const S = Math.max(16, +o.tamanho || 48), m = S / 2, r = S * 0.13;
    const s = `<circle cx="${f(m)}" cy="${f(m)}" r="${f(S * 0.46)}" fill="none" stroke="${FOCO}" stroke-opacity=".28" stroke-width="${f(Math.max(1, S / 48))}"${o.pulso ? ' data-pulso="1"' : ''}/>` +
      C(m, m, S * 0.27, FOCO, ' fill-opacity=".16"') + C(m, m, r, FOCO);
    return { w: S, h: S, s, fixo: true };
  };

  /* ---------- grade ---------- */
  formas.grade = (W, H, c, o) => {
    const e = Math.max(8, +o.espaco || 24), r = +o.raio || 1.4;
    let h = H;
    if (!(h > 8)) { const p = String(o.proporcao || '16/9').split('/').map(Number); h = W * (p[1] || 9) / (p[0] || 16); }
    const cols = Math.floor(W / e), rows = Math.floor(h / e);
    const ox = (W - (cols - 1) * e) / 2, oy = (h - (rows - 1) * e) / 2;
    const tinta = c.escuro ? '#9AA3B2' : '#4A525E', base = c.escuro ? 0.32 : 0.26;
    let s = '';
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = ox + i * e, y = oy + j * e;
      let a = base;
      if (o.desvanecer !== false) { const dx = (x / W - 0.5) * 2, dy = (y / h - 0.5) * 2; a = base * Math.max(0, 1 - Math.pow(Math.sqrt(dx * dx * 0.7 + dy * dy * 0.7), 2.2)); }
      if (a > 0.02) s += C(x, y, r, tinta, ` fill-opacity="${f(a)}"`);
    }
    if (o.foco) {
      const fo = Object.assign({ x: 0.68, y: 0.38 }, typeof o.foco === 'object' ? o.foco : {});
      const i = Math.round((fo.x * W - ox) / e), j = Math.round((fo.y * h - oy) / e);
      s += PF(ox + Math.max(0, Math.min(cols - 1, i)) * e, oy + Math.max(0, Math.min(rows - 1, j)) * e, Math.max(3, r * 2.4));
    }
    return { w: W, h, s, clip: true };
  };

  /* ---------- caminho (as 3 linhas) ---------- */
  const TRECHOS = [
    { rotulo: 'aprender', nome: 'Educação', texto: 'Você aprende o método e aplica no seu negócio.' },
    { rotulo: 'organizar', nome: 'Strategy', texto: 'A GrowAI organiza a receita junto com você.' },
    { rotulo: 'escalar', nome: 'Agentes', texto: 'Agentes de IA trabalham dentro da sua receita.' }
  ];
  formas.caminho = (W, H, c, o) => {
    const tr = TRECHOS.map((t, i) => Object.assign({}, t, (o.trechos || [])[i] || {}));
    const atual = o.atual == null ? -1 : +o.atual, desc = o.descricao !== false;
    let s = '', h;
    const titulo = (x, y, i, tam) => `<text x="${f(x)}" y="${f(y)}" fill="${c.texto}" style="${estilo(TIT, 500, tam, -tam * 0.015)}">GrowAI <tspan fill="${c.corTxt(ORDEM[i])}" style="font-style:italic">${esc(tr[i].nome)}</tspan></text>`;
    if (W >= 600) {
      const col = W / 3, yL = 46, gap = 6;
      for (let i = 0; i < 3; i++) {
        const x0 = i * col + (i ? gap / 2 : 0), x1 = (i + 1) * col - (i < 2 ? gap / 2 : 0), cor = c.cor(ORDEM[i]);
        s += `<rect x="${f(x0)}" y="${f(yL - 2)}" width="${f(x1 - x0)}" height="4" rx="2" fill="${cor}"/>`;
        s += C(x0 + 7, yL, 7, c.fundo, ` stroke="${cor}" stroke-width="2.5"`);
        if (i === atual) {
          s += PF(x0 + 7, yL - 0, 4.5);
          s += T(x0, 14, 'VOCÊ ESTÁ AQUI', MONO, 500, 11, c.focoTxt, 'start', 1.3);
        }
        const tx = x0, tw = col - 28;
        let y = yL + 34;
        s += T(tx, y, dois(i + 1) + ' · ' + tr[i].rotulo.toUpperCase(), MONO, 500, 12, c.corTxt(ORDEM[i]), 'start', 1.4);
        y += 30;
        const tam = Math.min(26, Math.max(19, col / 13));
        s += titulo(tx, y, i, tam, 'start');
        if (desc && tr[i].texto) { y += 10; quebra(tr[i].texto, LAB, 400, 16, tw, 4).forEach(l => { y += 23; s += T(tx, y - 5, l, LAB, 400, 16, c.apoio, 'start'); }); }
        h = Math.max(h || 0, y + 8);
      }
      /* seta no fim */
      s += `<path d="M${f(W - 8)},${f(yL - 6)} L${f(W - 1)},${f(yL)} L${f(W - 8)},${f(yL + 6)}" fill="none" stroke="${c.cor(ORDEM[2])}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      const xL = 10, tx = 38, tw = W - tx;
      let y = 0;
      const tops = [];
      for (let i = 0; i < 3; i++) {
        tops.push(y);
        let yy = y + 16;
        if (i === atual) { s += T(tx, yy - 2, 'VOCÊ ESTÁ AQUI', MONO, 500, 11, c.focoTxt, 'start', 1.3); yy += 20; }
        s += T(tx, yy, dois(i + 1) + ' · ' + tr[i].rotulo.toUpperCase(), MONO, 500, 12, c.corTxt(ORDEM[i]), 'start', 1.4);
        yy += 28;
        s += titulo(tx, yy, i, 23, 'start');
        if (desc && tr[i].texto) { yy += 6; quebra(tr[i].texto, LAB, 400, 16, tw, 4).forEach(l => { yy += 23; s += T(tx, yy - 5, l, LAB, 400, 16, c.apoio, 'start'); }); }
        y = yy + 26;
      }
      h = y - 18;
      const fim = [tops[1] - 6, tops[2] - 6, h];
      for (let i = 0; i < 3; i++) {
        const cor = c.cor(ORDEM[i]), y0 = tops[i] + 10;
        s += `<rect x="${f(xL - 2)}" y="${f(y0)}" width="4" height="${f(Math.max(4, fim[i] - y0))}" rx="2" fill="${cor}"/>`;
        s += C(xL, y0 + 2, 7, c.fundo, ` stroke="${cor}" stroke-width="2.5"`);
        if (i === atual) s += PF(xL, y0 + 2, 4.5);
      }
    }
    return { w: W, h, s };
  };
  const dois = n => (n < 10 ? '0' : '') + n;

  /* ---------- ciclo do gargalo ---------- */
  const CICLO = ['Medir', 'Diagnosticar', 'Focar', 'Destravar', 'Escalar'];
  formas.ciclo = (W, H, c, o) => {
    const et = (o.etapas || CICLO).map(String), n = et.length, fo = o.foco == null ? 2 : +o.foco;
    let fs = W < 420 ? 15 : 17;
    let labW = Math.max(...et.map(t => mede(t, LAB, 600, fs)));
    let R = Math.min(190, (W - 2 * (labW + 26)) / 2);
    if (R < 70) { fs = 14; labW = Math.max(...et.map(t => mede(t, LAB, 600, fs))); R = Math.max(62, Math.min(190, (W - 2 * (labW + 20)) / 2)); }
    const topo = 46, cx = W / 2, cy = topo + R;
    const ang = i => -Math.PI / 2 + i * TAU / n;
    const P = i => [cx + Math.cos(ang(i)) * R, cy + Math.sin(ang(i)) * R];
    let s = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="none" stroke="${c.fio}" stroke-width="1.5"/>`;
    /* setas: arcos entre as etapas, no sentido horário */
    const ab = 15 / R;
    for (let i = 0; i < n; i++) {
      const a0 = ang(i) + ab, a1 = ang(i + 1) - ab;
      s += `<path d="M${f(cx + Math.cos(a0) * R)},${f(cy + Math.sin(a0) * R)} A${f(R)},${f(R)} 0 0 1 ${f(cx + Math.cos(a1) * R)},${f(cy + Math.sin(a1) * R)}" fill="none" stroke="${c.apoio}" stroke-width="1.5"/>`;
      const px = cx + Math.cos(a1) * R, py = cy + Math.sin(a1) * R, tg = a1 + Math.PI / 2;
      const b1 = tg + Math.PI - 0.5, b2 = tg + Math.PI + 0.5;
      s += `<path d="M${f(px + Math.cos(b1) * 7)},${f(py + Math.sin(b1) * 7)} L${f(px)},${f(py)} L${f(px + Math.cos(b2) * 7)},${f(py + Math.sin(b2) * 7)}" fill="none" stroke="${c.apoio}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    let minY = 0, maxY = cy + R;
    for (let i = 0; i < n; i++) {
      const p = P(i), ehF = i === fo, cosA = Math.cos(ang(i)), sinA = Math.sin(ang(i));
      s += ehF ? PF(p[0], p[1], 6.5) : C(p[0], p[1], 6, c.fundo, ` stroke="${c.traco}" stroke-width="2"`);
      const anc = Math.abs(cosA) < 0.3 ? 'middle' : (cosA > 0 ? 'start' : 'end');
      const dx = anc === 'middle' ? 0 : (cosA > 0 ? 16 : -16);
      /* bloco de rótulo (número + nome, ~34 px) fora do círculo: em cima, embaixo ou ao lado */
      let ly;
      if (sinA < -0.5) ly = p[1] - 16;
      else if (sinA > 0.5) ly = p[1] + 12 + 30;
      else ly = p[1] + 4 + (sinA < -0.2 ? -2 : 8);
      const num = dois(i + 1);
      s += T(p[0] + dx, ly - 18, num, MONO, 500, 11, ehF ? c.focoTxt : c.apoio, anc, 1.2);
      s += T(p[0] + dx, ly, et[i], LAB, 600, fs, c.texto, anc);
      minY = Math.min(minY, ly - 30); maxY = Math.max(maxY, ly + 8);
    }
    if (o.centro !== false) {
      const txt = o.centro || 'Um gargalo por vez';
      const tc = R < 110 ? 15 : 19;
      const ls = quebra(txt, TITI, 400, tc, R * 1.15, 3);
      const lh = tc * 1.18;
      ls.forEach((l, i) => { s += T(cx, cy - (ls.length - 1) * lh / 2 + i * lh + tc * 0.3, l, TITI, 400, tc, c.texto, 'middle'); });
    }
    const off = minY < 0 ? -minY : 0;
    return { w: W, h: maxY + off + 6, s: off ? `<g transform="translate(0 ${f(off)})">${s}</g>` : s };
  };

  /* ---------- ponteiro (medidor) ---------- */
  formas.ponteiro = (W, H, c, o) => {
    const S = Math.max(220, Math.min(W, o.tamanho || 440));
    const cx = S / 2, R = S / 2 - 22, cy = R + 30, esp = Math.max(10, S * 0.035);
    const v = Math.max(0, Math.min(100, +o.valor || 0));
    const pa = p => Math.PI + (p / 100) * Math.PI;
    const arco = (p0, p1) => `M${f(cx + Math.cos(pa(p0)) * R)},${f(cy + Math.sin(pa(p0)) * R)} A${f(R)},${f(R)} 0 0 1 ${f(cx + Math.cos(pa(p1)) * R)},${f(cy + Math.sin(pa(p1)) * R)}`;
    let s = `<path d="${arco(0, 100)}" fill="none" stroke="${c.fio}" stroke-width="${f(esp)}" stroke-linecap="butt"/>`;
    if (Array.isArray(o.zona)) {
      const z0 = Math.max(0, +o.zona[0]), z1 = Math.min(100, +o.zona[1]);
      s += `<path d="${arco(z0, z1)}" fill="none" stroke="${c.linha ? c.traco : mistura(c.fundo, c.texto, c.escuro ? 0.5 : 0.45)}" stroke-width="${f(esp)}"/>`;
      const zm = pa((z0 + z1) / 2), rz = (o.rotuloZona || 'Meta').toUpperCase();
      s += T(cx + Math.cos(zm) * (R + esp / 2 + 12), cy + Math.sin(zm) * (R + esp / 2 + 12), rz, MONO, 500, 10.5, c.apoio, Math.cos(zm) > 0.2 ? 'start' : (Math.cos(zm) < -0.2 ? 'end' : 'middle'), 1.2);
    }
    for (let p = 0; p <= 100; p += 10) {
      const a = pa(p), r0 = R - esp / 2 - 4, r1 = R - esp / 2 - (p % 50 ? 9 : 14);
      s += `<line x1="${f(cx + Math.cos(a) * r0)}" y1="${f(cy + Math.sin(a) * r0)}" x2="${f(cx + Math.cos(a) * r1)}" y2="${f(cy + Math.sin(a) * r1)}" stroke="${c.apoio}" stroke-opacity=".6" stroke-width="1"/>`;
    }
    const a = pa(v), rp = R - Math.max(4.5, esp * 0.42) * 2.2;
    const tx = cx + Math.cos(a) * rp, ty = cy + Math.sin(a) * rp;
    s += `<line x1="${f(cx)}" y1="${f(cy)}" x2="${f(tx)}" y2="${f(ty)}" stroke="${c.texto}" stroke-width="2.5" stroke-linecap="round"/>`;
    s += C(cx, cy, 7, c.texto) + C(cx, cy, 2.5, c.fundo);
    s += PF(cx + Math.cos(a) * R, cy + Math.sin(a) * R, Math.max(4.5, esp * 0.42));
    const ext = o.extremos || ['0%', '100%'];
    s += T(cx - R, cy + 22, ext[0], MONO, 500, 12, c.apoio, 'middle') + T(cx + R, cy + 22, ext[1], MONO, 500, 12, c.apoio, 'middle');
    const vl = o.vrotulo != null ? String(o.vrotulo) : Math.round(v) + '%';
    const tam = Math.min(44, S * 0.11);
    let y = cy + 22 + tam;
    s += T(cx, y, vl, MONO, 500, tam, c.texto, 'middle', -tam * 0.03);
    if (o.rotulo) quebra(String(o.rotulo).toUpperCase(), MONO, 500, 11, S - 20, 2, 1.3).forEach(l => { y += 18; s += T(cx, y, l, MONO, 500, 11, c.apoio, 'middle', 1.3); });
    return { w: S, h: y + 8, s, fixo: true };
  };

  /* ---------- sinal (cartão de aviso) ---------- */
  formas.sinal = (W, H, c, o) => {
    const maxW = Math.min(W, +o.largura || 420);
    const card = cartao(c, maxW, o.rotulo == null ? 'Gargalo encontrado' : o.rotulo, o.texto || '', W < 360 ? 15 : 16);
    return { w: card.w, h: card.h, s: card.s, fixo: true };
  };

  /* ---------- montagem do SVG ---------- */
  function montaSvg(r, nome, o, id, dims) {
    const rot = o.aria;
    const a11y = rot ? `role="img" aria-labelledby="${id}-t"` : 'aria-hidden="true"';
    const tit = rot ? `<title id="${id}-t">${esc(rot)}</title>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" data-gforms="${nome}"${dims || ''} viewBox="0 0 ${f(r.w)} ${f(r.h)}" ${a11y} focusable="false"` +
      `${r.estilo ? ` style="${r.estilo}"` : ''}>${tit}${r.s}</svg>`;
  }
  function pulsa(t, o) {
    if (!o.pulso || semMovimento() || !Element.prototype.animate) return;
    const n = t.querySelector('[data-pulso]');
    if (!n) return;
    try {
      n.style.transformBox = 'fill-box'; n.style.transformOrigin = '50% 50%';
      n.animate([{ transform: 'scale(.35)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }], { duration: 1800, iterations: Infinity, easing: 'ease-out' });
    } catch (err) { /* ok */ }
  }
  function wrap(e, nome, o) {
    const t = el$(e); if (!t) return null;
    if (!t.__gfId) t.__gfId = 'gf' + (++seq);
    t.__gforms = { nome, opts: o };
    registro.add(t);
    observa(t);
    if (nome === 'radar') {
      if (!temDoc || typeof HTMLCanvasElement === 'undefined') nome = 'radar-svg';
      else { radarCanvas(t, o); return t; }
    }
    const c = cores(t, o);
    let W = 0;
    try { W = t.clientWidth; } catch (err) { W = 0; }
    if (!(W > 0)) W = 320;
    let H = 0;
    if (nome === 'grade' && !o.proporcao) { const ch = t.clientHeight; if (ch > 8) H = ch; }
    const r = formas[nome](W, H, c, o, t.__gfId);
    r.estilo = r.fixo ? `width:${f(r.w)}px;max-width:100%;height:auto;display:block;overflow:visible` + (o.centrar !== false && nome !== 'sinal' ? ';margin-inline:auto' : '')
      : `width:100%;height:auto;display:block;overflow:${r.clip ? 'hidden' : 'visible'}`;
    t.innerHTML = montaSvg(r, nome, o, t.__gfId);
    pulsa(t, o);
    return t;
  }

  const api = {};
  nomes.forEach(nome => { api[nome === 'radar-svg' ? 'radarSvg' : nome] = (e, o) => wrap(e, nome, o || {}); });
  const nomeDe = n => { n = String(n == null ? '' : n).trim().toLowerCase(); return (formas[n] || n === 'radar') ? n : (APELIDO[n] || n); };
  function render(e, nome, o) {
    const n = nomeDe(nome);
    if (formas[n] || n === 'radar') return wrap(e, n, Object.assign({}, o || {}));
    if (typeof console !== 'undefined') console.error('gforms: forma desconhecida "' + nome + '". Formas: ' + nomes.join(', ') + '.');
    return null;
  }
  /* SVG pronto (texto), fora da página: fundo transparente, cores do campo pedido (padrão noite) */
  const PADRAO = { 'radar-svg': 1080, aneis: 600, ponto: 96, grade: 1080, caminho: 1200, ciclo: 900, ponteiro: 560, sinal: 420 };
  function svg(nome, o) {
    o = Object.assign({ campo: 'noite' }, o || {});
    let n = nomeDe(nome);
    if (n === 'radar') n = 'radar-svg';
    if (!formas[n]) return '';
    const c = completa(Object.assign({}, PALETAS[o.campo] || PALETAS.noite), o);
    const id = 'gfx' + (++seqX);
    const W = +o.largura || PADRAO[n];
    const oo = Object.assign({}, o);
    if (n === 'radar-svg' || n === 'aneis' || n === 'ponteiro') oo.tamanho = oo.tamanho || W;
    const r = formas[n](W, 0, c, oo, id);
    return montaSvg(r, n, oo, id, ` width="${Math.round(r.w)}" height="${Math.round(r.h)}"`);
  }
  function montar(raiz) {
    if (!temDoc) return;
    (raiz || document).querySelectorAll('[data-gforms]').forEach(el => {
      if (el.__gformsMontado || el.tagName.toLowerCase() === 'svg') return;
      const v = el.getAttribute('data-gforms').trim();
      let cfg = { forma: v };
      if (v.charAt(0) === '{') { try { cfg = JSON.parse(v); } catch (err) { console.error('gforms: data-gforms não é JSON válido', el); return; } }
      const extra = el.getAttribute('data-gforms-opts');
      if (extra) { try { cfg = Object.assign(cfg, JSON.parse(extra)); } catch (err) { console.error('gforms: data-gforms-opts não é JSON válido', el); return; } }
      el.__gformsMontado = 1;
      render(el, cfg.forma, cfg);
    });
  }
  function redesenhar() {
    registro.forEach(t => {
      if (!t.isConnected) { registro.delete(t); return; }
      const c = t.__gforms;
      if (!c) return;
      if (c.nome === 'radar' && t.__rd) { dimensiona(t); estiloOverlay(t, t.__rd); if (!t.__rd.raf) liga(t); if (semMovimento()) quadroParado(t.__rd); return; }
      wrap(t, c.nome, c.opts);
    });
  }
  let ro = null, espera = 0;
  const larguras = new WeakMap();
  function observa(t) {
    if (!ro && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(es => {
        let mudou = false;
        es.forEach(en => { const w = Math.round(en.contentRect.width); if (larguras.get(en.target) !== w) { larguras.set(en.target, w); mudou = true; } });
        if (!mudou) return;
        clearTimeout(espera); espera = setTimeout(redesenhar, 100);
      });
    }
    if (ro && !larguras.has(t)) { larguras.set(t, Math.round(t.clientWidth || 0)); ro.observe(t); }
  }
  function parar() { radares.forEach(t => { pararRadar(t); if (t.__rd) quadroParado(t.__rd); }); api.animar = false; }
  function seguir() { api.animar = true; radares.forEach(t => liga(t)); }
  if (typeof window !== 'undefined' && temDoc) {
    window.addEventListener('beforeprint', () => { radares.forEach(t => { pararRadar(t); if (t.__rd) quadroParado(t.__rd); }); });
    window.addEventListener('afterprint', () => { if (api.animar !== false) radares.forEach(t => liga(t)); });
    document.addEventListener('visibilitychange', () => { radares.forEach(t => { if (document.hidden) pararRadar(t); else liga(t); }); });
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const muda = () => radares.forEach(t => { pararRadar(t); liga(t); });
      if (mq.addEventListener) mq.addEventListener('change', muda);
    } catch (err) { /* ok */ }
    try {
      if (document.fonts) {
        const comTexto = () => { cacheTxt.clear(); redesenhar(); };
        document.fonts.ready.then(comTexto);
        document.fonts.addEventListener('loadingdone', comTexto);
      }
    } catch (err) { /* sem API de fontes */ }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => montar());
    else montar();
  }
  return Object.assign(api, { render, montar, redesenhar, svg, parar, seguir, paletas: PALETAS, linhas: LINHAS, formas: nomes.slice(), contraste, animar: true, version: '3.0' });
})();
if (typeof window !== 'undefined') window.gforms = gforms;
