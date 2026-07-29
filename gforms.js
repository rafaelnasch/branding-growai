/* ═══════════ GFORMS — formas conceituais GrowAI v1 (SVG, zero dependências) ═══════════
   A ilustração da casa: quando o slide precisa de uma FORMA (não de um dado),
   ela sai daqui — nunca de imagem de banco nem de emoji. Copie este bloco
   VERBATIM pro <script> do artefato, junto com o gviz quando houver dados.
   Linguagem: pontos e gradiente da marca sobre neutro frio, UM foco laranja
   por forma, glow discreto. `dark:true` pros slides escuros.
   Determinístico: ruído por seno (pn), nunca Math.random — mesmo input,
   mesmo desenho, em tela e no PDF.
   Conceitos: orbe = núcleo/foco/produto · aneis = crescimento/expansão ·
   horizonte = começo/lançamento (capa e closer) · campo = mercado/audiência ·
   seta = transformação/direção · onda = momentum/tendência. */
const gforms = (() => {
  let n = 0;
  const el$ = e => typeof e === 'string' ? document.getElementById(e) : e;
  const pn = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v); };
  const neutral = d => d ? 'rgba(255,255,255,.26)' : '#C9D1DE';
  const defs = id => `<defs>
    <linearGradient id="gfG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9A3D"/><stop offset=".55" stop-color="#FF6A1A"/><stop offset="1" stop-color="#E63C0A"/></linearGradient>
    <filter id="gfF${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>`;
  const wrap = (e, W, H, id, inner) => {
    const t = el$(e); if (!t) return;
    t.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" aria-hidden="true">${defs(id)}${inner}</svg>`;
  };

  /* ORBE — o núcleo em gradiente (eco do logo). Conceito: foco, produto, o centro. */
  function orbe(e, o = {}) {
    const id = ++n, S = o.s || 320, c = S / 2, r = S * .30;
    let s = `<circle cx="${c}" cy="${c + S * .04}" r="${r * 1.08}" fill="url(#gfG${id})" opacity=".45" filter="url(#gfF${id})"/>`;
    s += `<circle cx="${c}" cy="${c}" r="${r}" fill="url(#gfG${id})"/>`;
    s += `<ellipse cx="${c - r * .34}" cy="${c - r * .42}" rx="${r * .40}" ry="${r * .26}" fill="#FFFFFF" opacity=".20"/>`;
    /* órbita pontilhada com um satélite no foco */
    const or_ = r * 1.55;
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * Math.PI * 2;
      s += `<circle cx="${(c + or_ * Math.cos(a)).toFixed(1)}" cy="${(c + or_ * .62 * Math.sin(a)).toFixed(1)}" r="1.8" fill="${neutral(o.dark)}"/>`;
    }
    s += `<circle cx="${c + or_ * Math.cos(-.6)}" cy="${c + or_ * .62 * Math.sin(-.6)}" r="6" fill="url(#gfG${id})"/>`;
    wrap(e, S, S, id, s);
  }

  /* ANEIS — anéis de crescimento: núcleo + ondas concêntricas de pontos que se
     expandem e desvanecem. Conceito: crescimento, expansão, alcance. */
  function aneis(e, o = {}) {
    const id = ++n, S = o.s || 320, c = S / 2;
    let s = `<circle cx="${c}" cy="${c}" r="${S * .075}" fill="url(#gfG${id})"/>`;
    s += `<circle cx="${c}" cy="${c}" r="${S * .10}" fill="url(#gfG${id})" opacity=".35" filter="url(#gfF${id})"/>`;
    [.17, .25, .33, .41, .475].forEach((f, k) => {
      const r = S * f, nd = Math.round(r * .55), op = .9 - k * .19;
      for (let i = 0; i < nd; i++) {
        const a = (i / nd) * Math.PI * 2 + k * .35;
        s += `<circle cx="${(c + r * Math.cos(a)).toFixed(1)}" cy="${(c + r * Math.sin(a)).toFixed(1)}" r="${(2.6 - k * .38).toFixed(2)}" fill="${k === 1 ? `url(#gfG${id})` : neutral(o.dark)}" opacity="${op.toFixed(2)}"/>`;
      }
    });
    wrap(e, S, S, id, s);
  }

  /* HORIZONTE — arcos de pontos nascendo da borda inferior (a "aura de
     crescimento"). Conceito: começo, lançamento. É a assinatura de capa e closer. */
  function horizonte(e, o = {}) {
    const id = ++n, W = o.w || 1440, H = o.h || 240, cx = W / 2, cy = H + 70;
    const rings = [{ r: 170, d: 4.4, op: .95 }, { r: 236, d: 3.6, op: .66 }, { r: 302, d: 2.9, op: .44 }, { r: 368, d: 2.3, op: .27 }, { r: 434, d: 1.8, op: .15 }];
    let s = `<ellipse cx="${cx}" cy="${H + 44}" rx="${W * .30}" ry="96" fill="url(#gfG${id})" opacity="${o.dark ? .42 : .26}" filter="url(#gfF${id})"/>`;
    rings.forEach(g => {
      const nd = Math.round(g.r * .34);
      for (let i = 0; i <= nd; i++) {
        const a = Math.PI + (i / nd) * Math.PI;
        const x = cx + g.r * Math.cos(a), y = cy + g.r * Math.sin(a);
        if (y < 6 || y > H - 2) continue;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${g.d}" fill="url(#gfG${id})" opacity="${g.op}"/>`;
      }
    });
    wrap(e, W, H, id, s);
  }

  /* CAMPO — campo de pontos com uma zona quente. Conceito: mercado, audiência,
     base de clientes — e onde a energia está concentrada. */
  function campo(e, o = {}) {
    const id = ++n, W = o.w || 640, H = o.h || 300, step = o.step || 15;
    const fx = .66, fy = .40;                     /* zona quente no terço direito */
    let s = '';
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
      const u = x / W, v = y / H;
      const base = .28 + pn(x * .11, y * .11) * .5;
      const d = Math.hypot((u - fx) * 1.1, (v - fy)), hot = Math.max(0, 1 - d * 2.6);
      const r = (base * .55 + hot * 1.1) * step * .30;
      if (r < 1.1) continue;
      s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${hot > .38 ? `url(#gfG${id})` : neutral(o.dark)}" opacity="${(hot > .38 ? .95 : .75).toFixed(2)}"/>`;
    }
    wrap(e, W, H, id, s);
  }

  /* SETA — seta em matriz de pontos, adensando até a ponta em gradiente.
     Conceito: transformação, direção, próximo passo. */
  function seta(e, o = {}) {
    const id = ++n, W = o.w || 640, H = o.h || 220, step = o.step || 13;
    let s = '';
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
      const u = x / W, v = y / H;
      const shaft = u < .60 && Math.abs(v - .5) < .17;
      const head = u >= .60 && Math.abs(v - .5) < (1 - (u - .60) / .40) * .46;
      if (!shaft && !head) continue;
      const b = .18 + u * .82, r = b * step * .38;
      s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${u > .60 ? `url(#gfG${id})` : neutral(o.dark)}" opacity="${(.55 + b * .45).toFixed(2)}"/>`;
    }
    wrap(e, W, H, id, s);
  }

  /* ONDA — crista de pontos com flecos em gradiente. Conceito: momentum,
     tendência, o movimento que não para. */
  function onda(e, o = {}) {
    const id = ++n, W = o.w || 640, H = o.h || 220, step = o.step || 12;
    let s = '';
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
      const u = x / W, v = y / H;
      const crest = .38 + .20 * Math.sin(u * 8) + .07 * Math.sin(u * 21 + 2);
      const d = v - crest; if (d < 0) continue;
      const b = Math.min(1, d * 2.4), r = (.9 + b * 2.6) * (step / 12);
      const fleck = d < .10 && pn(x * .07, y * .07) > .62;
      s += `<circle cx="${x}" cy="${y}" r="${r.toFixed(2)}" fill="${fleck ? `url(#gfG${id})` : neutral(o.dark)}" opacity="${(fleck ? .95 : .30 + b * .45).toFixed(2)}"/>`;
    }
    wrap(e, W, H, id, s);
  }

  return { orbe, aneis, horizonte, campo, seta, onda };
})();
