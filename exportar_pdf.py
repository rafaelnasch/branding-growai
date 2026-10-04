#!/usr/bin/env python3
"""Exporta um HTML da GrowAI em PDF.
Uso, na pasta do manual: python3 exportar_pdf.py [arquivo.html]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

# o arquivo fica na mesma pasta do script
PASTA = Path(__file__).resolve().parent
NOME = sys.argv[1] if len(sys.argv) > 1 \
    else "brand-book.html"
ARQUIVO = PASTA / NOME
SAIDA = ARQUIVO.with_suffix(".pdf")

with sync_playwright() as p:
    nav = p.chromium.launch()
    pag = nav.new_page(
        viewport={"width": 1200, "height": 900})
    pag.goto(ARQUIVO.as_uri(),
             wait_until="networkidle")
    # fotos de carregamento tardio entram já
    pag.evaluate(
        "document.querySelectorAll("
        "'img[loading=lazy]')"
        ".forEach(i => i.loading = 'eager')")
    # espera cada foto terminar de carregar
    pag.wait_for_function(
        "Array.from(document.images)"
        ".every(i => i.complete)",
        timeout=60000)
    # fontes e gráficos montados na página
    pag.evaluate("document.fonts.ready")
    pag.wait_for_timeout(1500)
    # print_background=True é obrigatório:
    # sem ele, a noite e o laranja somem.
    # prefer_css_page_size=True respeita a
    # página e as margens do próprio arquivo.
    # Não passe margin: a capa sai sem margem.
    pag.pdf(path=str(SAIDA),
            print_background=True,
            prefer_css_page_size=True)
    nav.close()

# conferência: um PDF sem nenhum texto é um PDF em branco (o rasterizador
# de impressão pode desistir em silêncio). Falha em voz alta.
dados = SAIDA.read_bytes()
paginas = dados.count(b"/Type /Page") - dados.count(b"/Type /Pages")
texto = None
try:
    from pypdf import PdfReader
    leitor = PdfReader(str(SAIDA))
    texto = sum(len((pg.extract_text() or "").strip()) for pg in leitor.pages[:40])
except ImportError:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(str(SAIDA))
        texto = sum(len(doc[i].get_text().strip()) for i in range(min(40, len(doc))))
    except ImportError:
        texto = None
if texto is None:
    # sem leitor de PDF: procura ao menos uma fonte embutida
    texto = 1 if b"/FontFile" in dados else 0
if not texto:
    sys.exit("ERRO: o PDF saiu sem texto (páginas em branco). Abra o HTML no Chrome, "
             "Imprimir, e confira; ou exporte por partes.")
print("PDF gravado em", SAIDA, "·", paginas, "páginas")
