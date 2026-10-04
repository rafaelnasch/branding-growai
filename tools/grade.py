#!/usr/bin/env python3
"""Grade Noite da GrowAI: tratamento de cor do banco de fotografia (SPEC v4, seção 2).

Uso (rodar com o Python que tem Pillow e numpy; caminhos a partir da raiz do pacote):
  python grade.py                      # trata todas as fotos de _build/fotos-originais
  python grade.py arquivo.jpg [...]    # trata só os arquivos indicados
  python grade.py --sem-grao           # desliga a granulação
  python grade.py --so-tratada | --so-duo
  python grade.py --fundador           # só o retrato do fundador
  python grade.py --folhas             # só as folhas de conferência e os antes/depois
  python grade.py --derivados          # só as versões leves de assets/fotos/web/ (480 e 1200 px)

Saídas em assets/fotos/:
  <slug>.jpg        cor tratada, 2000 px no lado maior, qualidade 82, progressivo
  <slug>-duo.jpg    duotone noite (#0B0D12 -> #EEF1F5), 1600 px, qualidade 72
  rafael-nasch.jpg / rafael-nasch-duo.jpg   retrato do fundador (560 x 700)
  antes-depois-1.jpg / antes-depois-2.jpg   original à esquerda, tratada à direita
e _build/v4/fotos-folha.png (folha de conferência).

A REGRA, em parâmetros (ordem de aplicação):
  1. Contraste médio: curva em S leve, x + 0,12 * (x - 0,5) * 4x(1 - x).
  2. Elemento quente: máscara para matiz 0°-50° (com rampa), saturação a partir
     de 0,42 e brilho a partir de 0,25. A trava de saturação deixa a pele de
     fora; o que passa é luz de tungstênio, parede, objeto laranja.
  3. Meios-tons dessaturados: saturação x 0,75 na luminância 0,5 e x 0,85 nas
     pontas (cerca de -25% no meio). O elemento quente não perde saturação:
     ganha x 1,08 e tem a matiz puxada 60% para 21° (o laranja #FF6A1A).
  4. Realces neutros: acima da luminância 0,70 a cor converge para o cinza da
     própria luminância, com força de até 0,35 (0,105 no elemento quente).
  5. Sombras para o azul-noite: abaixo da luminância 0,55, mistura de até 0,75
     com um alvo = #0B0D12 + L * (1 - #0B0D12) * 0,78, enviesado a frio
     (R x 0,90, G x 0,95, B x 1,10). Depois a faixa inteira é remapeada para
     preto em #0B0D12 e teto em #F4F5F7 (nunca preto nem branco puros).
  6. Granulação leve: ruído gaussiano monocromático, desvio 0,004, peso 0,6 a
     1,0 (maior nos meios-tons), semente fixa. Opcional (--sem-grao).
Duotone noite: luminância (Rec. 709) com a mesma curva em S de força 0,15 e
gama 1,05, mapeada linearmente de #0B0D12 (sombra) para #EEF1F5 (luz).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parents[1]  # tools/grade.py -> raiz do pacote
ORIG = RAIZ / "_build" / "fotos-originais"
SAIDA = RAIZ / "assets" / "fotos"

NOITE = np.array([0x0B, 0x0D, 0x12], dtype=np.float32) / 255.0
DIA = np.array([0xEE, 0xF1, 0xF5], dtype=np.float32) / 255.0
BRANCO_TETO = np.array([0xF4, 0xF5, 0xF7], dtype=np.float32) / 255.0
LARANJA_H = 21.0 / 360.0  # matiz de #FF6A1A

P = dict(
    sombra_forca=0.75, sombra_limite=0.55,
    sat_meio=0.75, sat_bordas=0.85,
    realce_inicio=0.70, realce_forca=0.35,
    curva_s=0.12,
    quente_h_min=0.0, quente_h_max=50.0, quente_s_min=0.42, quente_v_min=0.25,
    quente_puxar=0.60, quente_sat=1.08,
    grao=0.004,
    duo_contraste=0.15, duo_gama=1.05,
    lado_tratada=2000, q_tratada=82,
    lado_duo=1600, q_duo=72,
)


def lum(rgb):
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-6
    rc = np.where(m, (mx - r) / np.where(m, d, 1), 0)
    gc = np.where(m, (mx - g) / np.where(m, d, 1), 0)
    bc = np.where(m, (mx - b) / np.where(m, d, 1), 0)
    h = np.where(r == mx, bc - gc, np.where(g == mx, 2.0 + rc - bc, 4.0 + gc - rc))
    h = np.where(m, (h / 6.0) % 1.0, 0)
    s = np.where(mx > 1e-6, d / np.where(mx > 1e-6, mx, 1), 0)
    return np.stack([h, s, mx], -1)


def hsv_to_rgb(hsv):
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    i = np.floor(h * 6.0).astype(int) % 6
    f = h * 6.0 - np.floor(h * 6.0)
    p = v * (1 - s); q = v * (1 - s * f); t = v * (1 - s * (1 - f))
    sel = [np.stack(x, -1) for x in ((v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q))]
    out = np.zeros_like(hsv)
    for k in range(6):
        out = np.where((i == k)[..., None], sel[k], out)
    return out


def redimensionar(im, lado):
    w, h = im.size
    f = lado / max(w, h)
    if f < 1:
        im = im.resize((round(w * f), round(h * f)), Image.LANCZOS)
    return im


def grade_noite(im, grao=True, seed=7):
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    L = lum(rgb)

    # 4. contraste médio: S suave em torno de 0,5
    k = P["curva_s"]
    rgb = np.clip(rgb + k * (rgb - 0.5) * 4 * rgb * (1 - rgb), 0, 1)

    hsv = rgb_to_hsv(rgb)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    L = lum(rgb)

    # 5. máscara do elemento quente (laranja, âmbar, luz de tungstênio)
    hd = h * 360.0
    w_h = smooth(P["quente_h_min"] - 8, P["quente_h_min"] + 4, hd) * (1 - smooth(P["quente_h_max"] - 10, P["quente_h_max"] + 6, hd))
    w_h = np.maximum(w_h, smooth(352, 358, hd))  # vermelhos-alaranjados perto de 360°
    w_q = w_h * smooth(P["quente_s_min"], P["quente_s_min"] + 0.20, s) * smooth(P["quente_v_min"], P["quente_v_min"] + 0.15, v)

    # 2. dessaturação: -25% no meio, -15% nas bordas
    meio = 1 - np.abs(L - 0.5) * 2  # 1 no meio, 0 nas pontas
    fator = P["sat_bordas"] + (P["sat_meio"] - P["sat_bordas"]) * meio
    fator_q = fator * (1 - w_q) + P["quente_sat"] * w_q
    s2 = np.clip(s * fator_q, 0, 1)

    # matiz quente puxada para o laranja da marca (caminho curto no círculo)
    dh = ((LARANJA_H - h + 0.5) % 1.0) - 0.5
    h2 = (h + dh * P["quente_puxar"] * w_q) % 1.0

    rgb = hsv_to_rgb(np.stack([h2, s2, v], -1))
    L = lum(rgb)

    # 3. realces neutros
    wr = smooth(P["realce_inicio"], 1.0, L)[..., None] * P["realce_forca"] * (1 - w_q[..., None] * 0.7)
    rgb = rgb * (1 - wr) + L[..., None] * wr

    # 1. sombras para o azul-noite: tinge e levanta o preto até #0B0D12
    ws = (1 - smooth(0.0, P["sombra_limite"], L))[..., None] * P["sombra_forca"]
    alvo = NOITE + L[..., None] * (1 - NOITE) * 0.78  # mantém o desenho da sombra
    alvo = alvo * np.array([0.90, 0.95, 1.10], dtype=np.float32)  # viés frio
    rgb = rgb * (1 - ws) + alvo * ws
    rgb = NOITE + rgb * (BRANCO_TETO - NOITE)  # preto em #0B0D12, teto em #F4F5F7

    # 6. granulação leve
    if grao and P["grao"] > 0:
        rng = np.random.default_rng(seed)
        n = rng.normal(0, P["grao"], L.shape).astype(np.float32)
        peso = 0.6 + 0.4 * (1 - np.abs(lum(rgb) - 0.45) * 2).clip(0, 1)
        rgb = rgb + (n * peso)[..., None]

    return Image.fromarray((np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8))


def duotone_noite(im):
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    L = lum(rgb)
    k = P["duo_contraste"]
    L = np.clip(L + k * (L - 0.5) * 4 * L * (1 - L), 0, 1) ** P["duo_gama"]
    out = NOITE + L[..., None] * (DIA - NOITE)
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8))


def salvar(im, caminho, q):
    im.save(caminho, "JPEG", quality=q, progressive=True, optimize=True, subsampling="4:2:0")


def processar(arq, grao=True, tratada=True, duo=True):
    slug = Path(arq).stem
    im = Image.open(arq)
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass
    im = im.convert("RGB")
    if tratada:
        t = grade_noite(redimensionar(im, P["lado_tratada"]), grao=grao)
        salvar(t, SAIDA / f"{slug}.jpg", P["q_tratada"])
    if duo:
        d = duotone_noite(redimensionar(im, P["lado_duo"]))
        salvar(d, SAIDA / f"{slug}-duo.jpg", P["q_duo"])
    return slug


def retiradas():
    """Slugs marcados como fora do banco em creditos.json: não voltam para assets/fotos/."""
    import json
    try:
        dados = json.load(open(SAIDA / "creditos.json", encoding="utf-8"))
    except Exception:
        return set()
    return {f["arquivo"][:-4] for f in dados.get("fotos", []) if str(f.get("status", "")).startswith("fora")}


WEB = SAIDA / "web"
DERIVADOS = (480, 1200)


def derivados():
    """Versões leves para a página: assets/fotos/web/<nome>-480.jpg e -1200.jpg (lado maior, qualidade 78).
    O montador do livro usa as duas no srcset; o autocontido embute só a de 1200 (ou a de 480 nas miniaturas)."""
    WEB.mkdir(parents=True, exist_ok=True)
    feitos = 0
    for p in sorted(SAIDA.glob("*.jpg")):
        im = None
        for lado in DERIVADOS:
            alvo = WEB / f"{p.stem}-{lado}.jpg"
            if alvo.exists() and alvo.stat().st_mtime >= p.stat().st_mtime:
                continue
            im = im or Image.open(p).convert("RGB")
            d = im.copy(); d.thumbnail((lado, lado), Image.LANCZOS)
            d.save(alvo, "JPEG", quality=78, optimize=True, progressive=True); feitos += 1
    # apaga derivado órfão (foto que saiu do banco)
    for d in WEB.glob("*.jpg"):
        base = d.stem.rsplit("-", 1)[0]
        if not (SAIDA / f"{base}.jpg").exists():
            d.unlink()
    print("derivados web:", feitos)


FOLHA = RAIZ / "_build" / "v4" / "fotos-folha.png"
FONTE_RETRATO = RAIZ / "_build" / "fonte" / "rafael-nasch.png"
PARES_ANTES_DEPOIS = ["dono-ligacao-escritorio", "ambiente-barbearia-bairro"]  # sem pose: ninguém olha para a câmera
PARES_FOLHA = ["dona-mesa-amarela", "time-quadro-laranja", "detalhe-cafe-janela", "dono-noite-cidade"]


def fundador():
    """Retrato do fundador a partir do avatar oficial (círculo com arco laranja).
    O PNG tem fundo preto com cantos transparentes: compõe sobre preto e recorta
    um 4:5 de ombros para cima, acima do arco laranja e do selo."""
    im = Image.open(FONTE_RETRATO).convert("RGBA")
    base = Image.new("RGBA", im.size, (0, 0, 0, 255))
    base.alpha_composite(im)
    # 04/10/2026: o recorte desce 45 px para dar 8 a 10% de ar acima da cabeça;
    # a faixa acima da foto original é completada com preto (o fundo do retrato já é preto).
    tela = Image.new("RGBA", (im.width, im.height + 60), (0, 0, 0, 255))
    tela.alpha_composite(base, (0, 60))
    rec = tela.convert("RGB").crop((220, 45, 780, 745))  # 560 x 700
    salvar(grade_noite(rec), SAIDA / "rafael-nasch.jpg", 86)
    salvar(duotone_noite(rec), SAIDA / "rafael-nasch-duo.jpg", 82)


def _cabe(im, w, h):
    im = im.copy(); im.thumbnail((w, h), Image.LANCZOS); return im


def antes_depois(slug, n, largura=2000, gap=12):
    o = Image.open(ORIG / f"{slug}.jpg").convert("RGB")
    t = Image.open(SAIDA / f"{slug}.jpg").convert("RGB")
    meia = (largura - gap) // 2
    o = o.resize((meia, round(o.height * meia / o.width)), Image.LANCZOS)
    t = t.resize((meia, o.height), Image.LANCZOS)
    tela = Image.new("RGB", (largura, o.height), tuple(int(c * 255) for c in NOITE))
    tela.paste(o, (0, 0)); tela.paste(t, (meia + gap, 0))
    salvar(tela, SAIDA / f"antes-depois-{n}.jpg", 82)


def folhas():
    from PIL import ImageDraw, ImageFont
    try:
        fonte = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    except Exception:
        fonte = ImageFont.load_default()
    for i, s in enumerate(PARES_ANTES_DEPOIS, 1):
        antes_depois(s, i)
    tratadas = sorted(p for p in SAIDA.glob("*.jpg")
                      if not p.stem.endswith("-duo") and not p.stem.startswith("antes-depois"))
    T, cols, pad = 300, 8, 6
    linhas = (len(tratadas) + cols - 1) // cols
    alt_pares = len(PARES_FOLHA) * 330
    W, H = cols * T, linhas * (T + 22) + 60 + alt_pares
    fundo = tuple(int(c * 255) for c in NOITE)
    folha = Image.new("RGB", (W, H), fundo); d = ImageDraw.Draw(folha)
    for k, p in enumerate(tratadas):
        x, y = (k % cols) * T, (k // cols) * (T + 22)
        im = _cabe(Image.open(p).convert("RGB"), T - 2 * pad, T - 2 * pad)
        folha.paste(im, (x + (T - im.width) // 2, y + pad + (T - 2 * pad - im.height) // 2))
        d.text((x + pad, y + T - 2), p.stem, fill=(200, 205, 212), font=fonte)
    y0 = linhas * (T + 22) + 30
    d.text((pad, y0 - 22), "ANTES  |  GRADE NOITE  |  DUOTONE NOITE", fill=(255, 106, 26), font=fonte)
    for r, s in enumerate(PARES_FOLHA):
        for c, f in enumerate([ORIG / f"{s}.jpg", SAIDA / f"{s}.jpg", SAIDA / f"{s}-duo.jpg"]):
            im = _cabe(Image.open(f).convert("RGB"), 780, 310)
            folha.paste(im, (c * 800 + pad, y0 + r * 330))
    folha.save(FOLHA, optimize=True)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = {a for a in sys.argv[1:] if a.startswith("--")}
    SAIDA.mkdir(parents=True, exist_ok=True)
    if "--fundador" in flags:
        fundador(); sys.exit()
    if "--folhas" in flags:
        folhas(); derivados(); sys.exit()
    if "--derivados" in flags:
        derivados(); sys.exit()
    arquivos = [Path(a) for a in args] or [p for p in sorted(ORIG.glob("*.jpg")) if p.stem not in retiradas()]
    for a in arquivos:
        print(processar(a, grao="--sem-grao" not in flags,
                        tratada="--so-duo" not in flags, duo="--so-tratada" not in flags))
    if not args:
        fundador(); folhas()
    derivados()
