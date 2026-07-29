/* ═══════════ GVIZ — motor de gráficos GrowAI v1.1 (SVG, zero dependências) ═══════════
   A técnica de dados da casa: todo número vira forma por aqui. Copie este bloco
   VERBATIM pra dentro do <script> de cada artefato (documento ou deck).
   Regras embutidas: UM destaque laranja (gradiente da marca + glow) por gráfico,
   série neutra em cinza frio, números em Satoshi tabular, zero gridlines,
   baseline em hairline. `dark:true` troca a paleta neutra pros slides escuros.
   Determinístico: sem Math.random, mesmo input → mesmo desenho.
   v1.1: funil proporcional (piso 8%) com rótulo externo quando não cabe; hbars
   reserva largura real do maior vlabel (fim do clipping); colunas ancoram na
   baseline (canto arredondado só no topo); texto dentro de barra sempre forte. */
const gviz = (() => {
  let n = 0;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el$ = e => typeof e === 'string' ? document.getElementById(e) : e;
  const pal = d => d ? {
    bar: 'rgba(255,255,255,.20)', bar2: 'rgba(255,255,255,.32)', lab: '#9EA3B2', val: '#FFFFFF',
    axis: 'rgba(255,255,255,.14)', valHi: '#FFB37A', ringBg: 'rgba(255,255,255,.14)', inBar: 'rgba(255,255,255,.92)'
  } : {
    bar: '#C9D1DE', bar2: '#DDE3EC', lab: '#5B6472', val: '#3A4150',
    axis: '#E7EAF0', valHi: '#B33E0A', ringBg: '#E7EAF0', inBar: '#3A4150'
  };
  const F = {
    num: "font-family:var(--display,'Satoshi',sans-serif);font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em",
    lab: "font-family:var(--sans,'Inter',sans-serif);font-weight:500"
  };
  const defs = id => `<defs>
    <linearGradient id="gv${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A3D"/><stop offset=".55" stop-color="#FF6A1A"/><stop offset="1" stop-color="#E63C0A"/></linearGradient>
    <linearGradient id="gh${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9A3D"/><stop offset=".55" stop-color="#FF6A1A"/><stop offset="1" stop-color="#E63C0A"/></linearGradient>
    <filter id="gf${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>`;
  const wrap = (e, W, H, id, inner, label) => {
    const t = el$(e); if (!t) return;
    t.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || 'gráfico')}" style="width:100%;height:auto;display:block">${defs(id)}${inner}</svg>`;
  };
  /* coluna ancorada na baseline: canto arredondado SÓ no topo */
  const barTop = (x, y, w, h, r) => { r = Math.min(r, w / 2, h); return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`; };
  /* barra horizontal: canto arredondado SÓ na ponta direita */
  const barRight = (x, y, w, h, r) => { r = Math.min(r, h / 2, w); return `M${x},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x},${y + h} Z`; };

  /* Colunas — comparação/tendência mensal. highlight = índice do período que importa. */
  function bars(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 640, H = o.h || 300, pb = 46, pt = 34;
    const max = Math.max(...o.values), ph = H - pt - pb, cw = W / o.values.length;
    let s = '';
    o.values.forEach((v, i) => {
      const bh = Math.max(4, v / max * ph), bw = cw * .56, x = i * cw + (cw - bw) / 2, y = H - pb - bh, hi = i === o.highlight;
      const d = barTop(x, y, bw, bh, 9);
      if (hi) s += `<path d="${d}" fill="url(#gv${id})" opacity=".5" filter="url(#gf${id})"/>`;
      s += `<path d="${d}" fill="${hi ? `url(#gv${id})` : p.bar}"/>`;
      s += `<text x="${i * cw + cw / 2}" y="${y - 10}" text-anchor="middle" font-size="15" style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(o.vlabels ? o.vlabels[i] : v)}</text>`;
      s += `<text x="${i * cw + cw / 2}" y="${H - pb + 22}" text-anchor="middle" font-size="12" style="${F.lab};fill:${hi ? p.valHi : p.lab};${hi ? 'font-weight:600' : ''}">${esc(o.labels[i])}</text>`;
    });
    s += `<line x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}" stroke="${p.axis}" stroke-width="1"/>`;
    wrap(e, W, H, id, s, o.aria);
  }

  /* Barras horizontais — ranking. Reserva a largura REAL do maior vlabel (sem clipping). */
  function hbars(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 640, rowH = 44, gap = 14, labW = o.labw || 150;
    const vls = o.values.map((v, i) => String(o.vlabels ? o.vlabels[i] : v));
    const valW = Math.max(...vls.map(t => t.length)) * 8 + 20;
    const H = o.values.length * (rowH + gap) - gap, max = Math.max(...o.values), bw = W - labW - valW - 16;
    let s = '';
    o.values.forEach((v, i) => {
      const y = i * (rowH + gap), w = Math.max(4, v / max * bw), hi = i === o.highlight;
      const d = barRight(labW, y + 6, w, rowH - 12, 8);
      s += `<text x="${labW - 12}" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="13" style="${F.lab};fill:${hi ? p.val : p.lab};${hi ? 'font-weight:600' : ''}">${esc(o.labels[i])}</text>`;
      if (hi) s += `<path d="${d}" fill="url(#gh${id})" opacity=".5" filter="url(#gf${id})"/>`;
      s += `<path d="${d}" fill="${hi ? `url(#gh${id})` : p.bar}"/>`;
      s += `<text x="${labW + w + 12}" y="${y + rowH / 2 + 5}" font-size="15" style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(vls[i])}</text>`;
    });
    wrap(e, W, H, id, s, o.aria);
  }

  /* Anel — percentual único (conversão, share, "X% em N dias"). value 0–100. */
  function ring(e, o) {
    const id = ++n, p = pal(o.dark), S = o.s || 300, c = S / 2, r = c - 26, C = 2 * Math.PI * r;
    const frac = Math.min(1, Math.max(0, o.value / 100));
    const arc = x => `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#gh${id})" stroke-width="22" stroke-linecap="round" stroke-dasharray="${C * frac} ${C}" transform="rotate(-90 ${c} ${c})" ${x || ''}/>`;
    let s = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${p.ringBg}" stroke-width="22"/>`;
    s += arc(`opacity=".5" filter="url(#gf${id})"`) + arc();
    s += `<text x="${c}" y="${c + S * .03}" text-anchor="middle" font-size="${S * .21}" style="${F.num};fill:${p.val}">${esc(o.vlabel || (o.value + '%'))}</text>`;
    if (o.label) s += `<text x="${c}" y="${c + S * .15}" text-anchor="middle" font-size="11.5" letter-spacing="1.6" style="${F.lab};fill:${p.lab};text-transform:uppercase">${esc(o.label)}</text>`;
    wrap(e, S, S, id, s, o.aria);
  }

  /* Funil — estágios do pipeline. Largura ∝ valor (piso de 8%); quando o texto
     não cabe dentro da barra, rótulo e valor saem pra DIREITA da barra. */
  function funnel(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 560, rowH = 48, gap = 10;
    const H = o.stages.length * (rowH + gap) - gap, max = Math.max(...o.stages.map(t => t.value));
    let s = '';
    o.stages.forEach((st, i) => {
      const y = i * (rowH + gap), w = Math.max(W * .08, st.value / max * W), x = (W - w) / 2, hi = i === o.highlight;
      const vv = String(st.vlabel != null ? st.vlabel : st.value);
      if (hi) s += `<rect x="${x}" y="${y}" width="${w}" height="${rowH}" rx="11" fill="url(#gh${id})" opacity=".5" filter="url(#gf${id})"/>`;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${rowH}" rx="11" fill="${hi ? `url(#gh${id})` : p.bar}"/>`;
      const lw = st.label.length * 6.9 + 16, vw = vv.length * 8 + 16;
      if (lw + vw + 12 <= w) {
        s += `<text x="${x + 16}" y="${y + rowH / 2 + 4}" font-size="12.5" style="${F.lab};fill:${hi ? 'rgba(255,255,255,.92)' : p.inBar}">${esc(st.label)}</text>`;
        s += `<text x="${x + w - 16}" y="${y + rowH / 2 + 5}" text-anchor="end" font-size="15" style="${F.num};fill:${hi ? '#FFFFFF' : p.val}">${esc(vv)}</text>`;
      } else {
        /* fora da barra: escolhe o lado com mais espaço; se uma linha não couber, empilha em duas */
        const rs = W - (x + w) - 12, ls = x - 12;
        const side = rs >= ls ? { x: x + w + 12, a: 'start' } : { x: x - 12, a: 'end' };
        const sp = Math.max(rs, ls);
        if (lw + vw + 8 <= sp) {
          s += `<text x="${side.x}" y="${y + rowH / 2 + 5}" text-anchor="${side.a}" font-size="12.5" style="${F.lab};fill:${p.lab}">${esc(st.label)} <tspan font-size="15" style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(vv)}</tspan></text>`;
        } else {
          s += `<text x="${side.x}" y="${y + rowH / 2 - 5}" text-anchor="${side.a}" font-size="12.5" style="${F.lab};fill:${p.lab}">${esc(st.label)}</text>`;
          s += `<text x="${side.x}" y="${y + rowH / 2 + 14}" text-anchor="${side.a}" font-size="15" style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(vv)}</text>`;
        }
      }
    });
    wrap(e, W, H, id, s, o.aria);
  }

  /* Barra de composição 100% — concentração/participação (top 10, top 30, resto). */
  function share(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 640, barH = 30, H = barH + 48;
    const tot = o.segments.reduce((a, t) => a + t.value, 0);
    let x = 0, s = `<clipPath id="gc${id}"><rect x="0" y="0" width="${W}" height="${barH}" rx="10"/></clipPath><g clip-path="url(#gc${id})">`;
    o.segments.forEach((sg, i) => {
      const w = sg.value / tot * W, hi = i === o.highlight;
      s += `<rect x="${x}" y="0" width="${w}" height="${barH}" fill="${hi ? `url(#gh${id})` : (i % 2 ? p.bar2 : p.bar)}"/>`;
      x += w;
    });
    s += '</g>';
    let lx = 0; const lw = o.legw || W / o.segments.length;
    o.segments.forEach((sg, i) => {
      const hi = i === o.highlight;
      s += `<circle cx="${lx + 5}" cy="${barH + 27}" r="5" fill="${hi ? '#FF6A1A' : (i % 2 ? p.bar2 : p.bar)}"/>`;
      s += `<text x="${lx + 16}" y="${barH + 31}" font-size="12" style="${F.lab};fill:${p.lab}">${esc(sg.label)} <tspan style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(sg.vlabel != null ? sg.vlabel : sg.value)}</tspan></text>`;
      lx += lw;
    });
    wrap(e, W, H, id, s, o.aria);
  }

  /* Linha — tendência com ponto-destaque. area:false desliga o preenchimento suave. */
  function line(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 640, H = o.h || 260, pb = 40, pt = 30, px0 = 36;
    const max = Math.max(...o.values), min = Math.min(...o.values), rng = (max - min) || 1;
    const px = i => px0 + i * (W - 2 * px0) / (o.values.length - 1);
    const py = v => pt + (1 - (v - min) / rng) * (H - pt - pb);
    const pts = o.values.map((v, i) => `${px(i)},${py(v)}`).join(' ');
    let s = '';
    if (o.area !== false) s += `<polygon points="${px(0)},${H - pb} ${pts} ${px(o.values.length - 1)},${H - pb}" fill="url(#gv${id})" opacity=".10"/>`;
    s += `<polyline points="${pts}" fill="none" stroke="${p.val}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    o.values.forEach((v, i) => {
      const hi = i === o.highlight;
      if (hi) s += `<circle cx="${px(i)}" cy="${py(v)}" r="12" fill="#FF6A1A" opacity=".35" filter="url(#gf${id})"/><circle cx="${px(i)}" cy="${py(v)}" r="6" fill="url(#gv${id})"/>`;
      else s += `<circle cx="${px(i)}" cy="${py(v)}" r="4" fill="${p.val}"/>`;
      s += `<text x="${px(i)}" y="${py(v) - 14}" text-anchor="middle" font-size="13.5" style="${F.num};fill:${hi ? p.valHi : p.val}">${esc(o.vlabels ? o.vlabels[i] : v)}</text>`;
      s += `<text x="${px(i)}" y="${H - pb + 22}" text-anchor="middle" font-size="12" style="${F.lab};fill:${hi ? p.valHi : p.lab}">${esc(o.labels[i])}</text>`;
    });
    s += `<line x1="0" y1="${H - pb}" x2="${W}" y2="${H - pb}" stroke="${p.axis}"/>`;
    wrap(e, W, H, id, s, o.aria);
  }

  /* Fluxo — diagrama de etapas com conectores no MESMO sistema de coordenadas
     (regra de diagramas da casa: seta nunca posicionada na mão sobre HTML).
     steps: [{label, sub}] · highlight marca a etapa que importa. Rótulos curtos. */
  function flow(e, o) {
    const id = ++n, p = pal(o.dark), W = o.w || 640, boxH = 66, arrowW = 40, pad = 4;
    const k = o.steps.length, boxW = (W - arrowW * (k - 1) - pad * 2) / k, H = boxH + 16;
    const boxFill = o.dark ? 'rgba(255,255,255,.07)' : '#FFFFFF';
    const boxLine = o.dark ? 'rgba(255,255,255,.13)' : '#E7EAF0';
    let s = '';
    o.steps.forEach((st, i) => {
      const x = pad + i * (boxW + arrowW), y = 8, hi = i === o.highlight, cx = x + boxW / 2;
      if (hi) s += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="13" fill="url(#gh${id})" opacity=".5" filter="url(#gf${id})"/>`;
      s += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="13" fill="${hi ? `url(#gh${id})` : boxFill}" ${hi ? '' : `stroke="${boxLine}" stroke-width="1.5"`}/>`;
      const ly = st.sub ? y + boxH / 2 - 5 : y + boxH / 2 + 5;
      s += `<text x="${cx}" y="${ly}" text-anchor="middle" font-size="13.5" style="${F.lab};font-weight:600;fill:${hi ? '#FFFFFF' : (o.dark ? p.val : '#0C0F14')}">${esc(st.label)}</text>`;
      if (st.sub) s += `<text x="${cx}" y="${y + boxH / 2 + 15}" text-anchor="middle" font-size="11.5" style="${F.lab};fill:${hi ? 'rgba(255,255,255,.85)' : p.lab}">${esc(st.sub)}</text>`;
      if (i < k - 1) {
        const ax = x + boxW + 7, ay = y + boxH / 2, ae = x + boxW + arrowW - 7;
        s += `<line x1="${ax}" y1="${ay}" x2="${ae - 6}" y2="${ay}" stroke="${p.lab}" stroke-width="2" stroke-linecap="round"/>`;
        s += `<path d="M${ae - 8},${ay - 5.5} L${ae},${ay} L${ae - 8},${ay + 5.5}" fill="none" stroke="${p.lab}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    });
    wrap(e, W, H, id, s, o.aria);
  }

  return { bars, hbars, ring, funnel, share, line, flow };
})();
