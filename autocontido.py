#!/usr/bin/env python3
"""Gera a versão AUTOCONTIDA de um HTML da skill: um arquivo único que abre
sozinho (e-mail, WhatsApp, Drive, celular, claude.ai), sem a pasta assets/
e sem gviz.js/gforms.js ao lado.

O que faz:
1. cola gviz.js e gforms.js dentro do próprio HTML;
2. guarda cada imagem de assets/ UMA vez, em data URI, num dicionário no <head>;
3. um script troca todo src/href/srcset que começa com "assets/" pela imagem
   embutida, inclusive nos elementos que os motores criam depois;
4. url(assets/...) do CSS vira data URI direto;
5. embute as fontes do Google Fonts (Newsreader, Hanken Grotesk e IBM Plex Mono)
   em woff2, só os alfabetos latin e latin-ext, dentro da própria <style>: o arquivo
   aberto sem internet (WhatsApp, e-mail) continua com as letras certas. Os woff2
   ficam guardados em assets/fontes/ e servem de reserva quando não há internet.
   As três fontes têm licença SIL Open Font License (podem ser distribuídas).
6. foto embute só a versão leve (assets/fotos/web/, 1200 px; 480 px nas miniaturas)
   e o srcset sai; link de download (href para assets/) e link para outra página
   do pacote viram endereço público https://rafaelnasch.github.io/branding-growai/,
   para o arquivo enviado sozinho não carregar peso de download nem link quebrado.
Blocos <template> e textos de código não são alterados.

7. com Pillow instalado (pip install pillow), foto e imagem grande são recodificadas
   antes de embutir: o brand book fica abaixo de 15 MB, o que passa como anexo de
   e-mail. Sem Pillow funciona igual, com o arquivo maior.

Uso (Python padrão; Pillow opcional):
  python3 autocontido.py                      # gera dist/ com os quatro arquivos
  python3 autocontido.py meu-material.html    # gera dist/meu-material.html
"""
import base64, hashlib, json, mimetypes, os, re, sys, urllib.request

RAIZ = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(RAIZ, "dist")
PADRAO = {"brand-book.html": "brand-book-growai.html",
          "deck-template.html": "apresentacao-growai.html",
          "lockup.html": "assinaturas-growai.html",
          "guia-de-uso.html": "guia-de-uso-growai.html"}
RE_ASSET = re.compile(r"assets/[A-Za-z0-9_./-]+?\.(?:png|jpe?g|svg|webp|gif)")
FONTES = os.path.join(RAIZ, "assets", "fontes")
RE_LINK_FONTES = re.compile(r'<link\b[^>]*href="(https://fonts\.googleapis\.com/css2\?[^"]+)"[^>]*>\n?')
RE_PRECONNECT = re.compile(r'<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"[^>]*>\n?')
ALFABETOS = ("latin", "latin-ext")
PUBLICO = "https://rafaelnasch.github.io/branding-growai/"
FOTOS_WEB = os.path.join(RAIZ, "assets", "fotos", "web")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"


def baixa(url, timeout=30):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=timeout).read()


def fontes_embutidas(url):
    """CSS com @font-face em data URI (woff2, latin e latin-ext), ou None se não der.
    Pesos que usam o mesmo arquivo (fonte variável) viram um @font-face só, com faixa de peso."""
    url = url.replace("&amp;", "&")
    os.makedirs(FONTES, exist_ok=True)
    guardado = os.path.join(FONTES, "google-%s.css" % hashlib.sha1(url.encode()).hexdigest()[:10])
    try:
        css = baixa(url, 20).decode("utf-8")
        open(guardado, "w", encoding="utf-8").write(css)
    except Exception as erro:
        if not os.path.isfile(guardado):
            print("aviso: sem internet e sem cópia em assets/fontes/; as fontes continuam pelo link do Google (%s)" % erro)
            return None
        css = open(guardado, encoding="utf-8").read()
    grupos, ordem = {}, []
    for alfabeto, corpo in re.findall(r"/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{([^}]*)\}", css):
        if alfabeto not in ALFABETOS:
            continue
        prop = dict((k.strip(), v.strip()) for k, v in re.findall(r"([a-z-]+)\s*:\s*([^;]+);", corpo))
        fonte = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", prop.get("src", ""))
        if not fonte:
            continue
        chave = (prop.get("font-family"), prop.get("font-style"), fonte.group(1), prop.get("unicode-range"))
        if chave not in grupos:
            grupos[chave] = {"pesos": [], "alfabeto": alfabeto}
            ordem.append(chave)
        grupos[chave]["pesos"].append(int(prop.get("font-weight", "400").split()[0]))
    saida = []
    for chave in ordem:
        familia, estilo, link, faixa = chave
        local = os.path.join(FONTES, os.path.basename(link))
        try:
            if not os.path.isfile(local):
                open(local, "wb").write(baixa(link))
        except Exception as erro:
            print("aviso: não baixou %s (%s); as fontes continuam pelo link do Google" % (link, erro))
            return None
        pesos = sorted(set(grupos[chave]["pesos"]))
        peso = str(pesos[0]) if len(pesos) == 1 else "%d %d" % (pesos[0], pesos[-1])
        dado = base64.b64encode(open(local, "rb").read()).decode()
        saida.append("/* %s */\n@font-face{font-family:%s;font-style:%s;font-weight:%s;font-display:swap;"
                     "src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s;}"
                     % (grupos[chave]["alfabeto"], familia, estilo, peso, dado, faixa))
    return "\n".join(saida) if saida else None

TROCA = r"""<script>/* imagens embutidas: troca assets/... pela versão em data URI */
(function(){var A=window.__ROYAL_ASSETS=%s;
function url(v){return A[v]||v}
function set(el){if(!el||el.nodeType!==1)return;
 ["src","href","poster","srcset"].forEach(function(a){var d=el.getAttribute("data-asset-"+a);if(d!==null){el.removeAttribute("data-asset-"+a);el.setAttribute(a,a==="srcset"?d.replace(/assets\/[^\s,]+/g,url):url(d))}});
 ["src","href","poster"].forEach(function(a){var v=el.getAttribute(a);if(v&&v.indexOf("assets/")===0&&A[v])el.setAttribute(a,A[v])});
 var x=el.getAttributeNS&&el.getAttributeNS("http://www.w3.org/1999/xlink","href");
 if(x&&x.indexOf("assets/")===0&&A[x])el.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",A[x]);
 var s=el.getAttribute("srcset");if(s&&s.indexOf("assets/")>-1)el.setAttribute("srcset",s.replace(/assets\/[^\s,]+/g,url));}
function walk(r){set(r);if(r.querySelectorAll)r.querySelectorAll("[src],[href],[srcset],image,[data-asset-src],[data-asset-srcset],[data-asset-href]").forEach(set)}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")set(m.target);else m.addedNodes.forEach(function(n){if(n.nodeType===1)walk(n)})})})
 .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src","href","srcset","xlink:href"]});
document.addEventListener("DOMContentLoaded",function(){walk(document.documentElement)});})();
</script>"""


LEVE = 220 * 1024  # imagem raster acima disso é reduzida (se houver Pillow) antes de embutir


def data_uri(caminho):
    tipo = mimetypes.guess_type(caminho)[0] or "application/octet-stream"
    with open(caminho, "rb") as f:
        dado = f.read()
    foto = "/fotos/web/" in caminho.replace(os.sep, "/")
    if (len(dado) > LEVE or (foto and len(dado) > 40 * 1024)) and tipo in ("image/png", "image/jpeg"):
        try:  # opcional: sem Pillow, embute o arquivo como está
            import io
            from PIL import Image
            im = Image.open(io.BytesIO(dado))
            im.thumbnail((1000, 1000) if foto else (1400, 1400))
            saida = io.BytesIO()
            if im.mode in ("RGBA", "LA", "P") and "A" in im.convert("RGBA").getbands() and im.convert("RGBA").getextrema()[3][0] < 255:
                im.convert("RGBA").save(saida, "PNG", optimize=True)
                novo, novo_tipo = saida.getvalue(), "image/png"
            else:
                im.convert("RGB").save(saida, "JPEG", quality=68 if foto else 78, optimize=True, progressive=True)
                novo, novo_tipo = saida.getvalue(), "image/jpeg"
            if len(novo) < len(dado):
                dado, tipo = novo, novo_tipo
        except Exception:
            pass
    return "data:%s;base64,%s" % (tipo, base64.b64encode(dado).decode())


def foto_leve(caminho, lado=1200):
    """assets/fotos/x.jpg -> assets/fotos/web/x-1200.jpg, quando a versão leve existe."""
    m = re.match(r"assets/fotos/([a-z0-9-]+)\.jpg$", caminho)
    if m and os.path.isfile(os.path.join(FOTOS_WEB, "%s-%d.jpg" % (m.group(1), lado))):
        return "assets/fotos/web/%s-%d.jpg" % (m.group(1), lado)
    return caminho


def enxugar(html):
    """Fotos na versão leve, sem srcset; links de download e de outras páginas viram endereço público."""
    def img(m):
        tag = m.group(0)
        mini = re.search(r'sizes="(\d+)px"', tag)
        lado = 480 if mini and int(mini.group(1)) <= 480 else 1200
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', "", tag)
        return re.sub(r'src="(assets/fotos/[a-z0-9-]+\.jpg)"', lambda f: 'src="%s"' % foto_leve(f.group(1), lado), tag)
    html = re.sub(r"<img\b[^>]*>", img, html)
    # url(assets/fotos/x.jpg) e caminhos de foto em dados (data-gforms, JSON) também,
    # mas nunca dentro de <pre>, <code>, <template> ou <textarea> (texto de documentação)
    partes = re.split(r"(<(pre|code|template|textarea)\b[\s\S]*?</\2>)", html)
    html = "".join(p if i % 3 else re.sub(r"assets/fotos/[a-z0-9-]+\.jpg", lambda m: foto_leve(m.group(0)), p)
                   for i, p in enumerate(partes) if i % 3 != 2)
    # <a href="assets/..."> (download): o arquivo fica no endereço público, não no HTML
    html = re.sub(r'(<a\b[^>]*\shref=")(assets/[^"]+)"', lambda m: '%s%s%s"' % (m.group(1), PUBLICO, m.group(2)), html)
    # <a href="pagina.html#ancora">: vira o endereço público, que abre de qualquer lugar
    html = re.sub(r'(<a\b[^>]*\shref=")([a-z0-9-]+\.html)(#[^"]*)?"',
                  lambda m: '%s%s%s%s"' % (m.group(1), PUBLICO, m.group(2), m.group(3) or ""), html)
    return html


def autocontido(origem, destino):
    html = open(origem, encoding="utf-8").read()
    html = enxugar(html)
    # 0. fontes do Google embutidas na própria <style> (continua uma <style> só)
    link = RE_LINK_FONTES.search(html)
    if link:
        css = fontes_embutidas(link.group(1))
        if css:
            html = RE_PRECONNECT.sub("", RE_LINK_FONTES.sub("", html, count=1))
            html = html.replace("<style>", "<style>\n/* Fontes embutidas (SIL Open Font License): latin e latin-ext */\n" + css + "\n", 1)
    # 1. motores dentro do arquivo
    for js in ("gviz.js", "gforms.js"):
        tag = '<script src="%s"></script>' % js
        if tag in html:
            codigo = open(os.path.join(RAIZ, js), encoding="utf-8").read()
            html = html.replace(tag, "<script>/* %s */\n%s\n</script>" % (js, codigo))
    # 2. dicionário de imagens (cada arquivo uma vez só)
    usados = sorted(set(m.group(0) for m in RE_ASSET.finditer(html)))
    mapa, faltando = {}, []
    for p in usados:
        c = os.path.join(RAIZ, p)
        (mapa.__setitem__(p, data_uri(c)) if os.path.isfile(c) else faltando.append(p))
    # 3. CSS url(assets/...) vira data URI direto
    html = re.sub(r"url\(\s*(['\"]?)(assets/[^)'\"]+)\1\s*\)",
                  lambda m: "url(%s)" % json.dumps(mapa.get(m.group(2), m.group(2))), html)
    # 4. atributos estáticos (fora de template, pre, script, textarea e style) viram
    #    data-asset-*: o navegador não tenta buscar o arquivo que não existe
    partes = re.split(r"(<(template|pre|script|textarea|style)\b[\s\S]*?</\2>)", html)
    saida, i = [], 0
    while i < len(partes):
        trecho = partes[i]
        if i % 3 == 0:
            # duas passadas: uma tag pode ter src e srcset ao mesmo tempo
            trecho = re.sub(r'(<(?:img|source|image|link|video)\b[^>]*?\s)(src|srcset|href|poster)="(assets/[^"]*)"',
                            lambda m: '%sdata-asset-%s="%s"' % (m.group(1), m.group(2), m.group(3)), trecho)
            trecho = re.sub(r'(<(?:img|source|image|link|video)\b[^>]*?\s)(src|srcset|href|poster)="(assets/[^"]*)"',
                            lambda m: '%sdata-asset-%s="%s"' % (m.group(1), m.group(2), m.group(3)), trecho)
            saida.append(trecho); i += 1
        else:
            saida.append(trecho); i += 2
    html = "".join(saida)
    # 5. o script de troca entra logo no começo do <head>
    bloco = TROCA % json.dumps(mapa, separators=(",", ":"))
    html = re.sub(r"(<meta charset=[^>]*>)", lambda m: m.group(1) + "\n" + bloco, html, count=1) \
        if re.search(r"<meta charset=", html) else html.replace("<head>", "<head>\n" + bloco, 1)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino, "w", encoding="utf-8").write(html)
    print("ok %s  %d KB  imagens=%d%s" % (destino, len(html.encode()) // 1024, len(mapa),
          ("  sem arquivo (ficam como estão): " + ", ".join(faltando)) if faltando else ""))


if __name__ == "__main__":
    alvos = sys.argv[1:] or list(PADRAO)
    for a in alvos:
        o = a if os.path.isabs(a) else os.path.join(RAIZ, a)
        autocontido(o, os.path.join(DIST, PADRAO.get(os.path.basename(a), os.path.basename(a))))
