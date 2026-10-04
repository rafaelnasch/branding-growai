# branding-growai

**A identidade da GrowAI, empacotada como uma Skill do Claude.** Sistema Radar de Foco v4, tipografia Editorial.

Instale uma vez e peça o material em português. O Claude passa a produzir página, Raio-X do Negócio, proposta, apresentação, relatório, painel do portal Strategy, post, carrossel, story, thumbnail, anúncio, capa, e-mail, assinatura, cartão, peça de evento e mensagem de WhatsApp **já no padrão da GrowAI**: cor certa, fonte certa, logo certo, foto certa, voz certa e as regras de prova, sem você precisar explicar nada disso de novo.

> "Faz a capa e os 8 slides da proposta do Diagnóstico do Gargalo para a Empresa Exemplo, linha Strategy."
> "Cria um post de tese e um de prova para a semana, no padrão GrowAI."
> "Monta o relatório mensal da Empresa Exemplo com a restrição ativa no topo."

**Ver o brand book no navegador:** [rafaelnasch.github.io/branding-growai](https://rafaelnasch.github.io/branding-growai/) (abre em qualquer aparelho, sem instalar nada). Pedidos prontos para copiar: [guia de uso](https://rafaelnasch.github.io/branding-growai/guia-de-uso.html).

---

## O sistema em seis linhas

1. **O sistema de foco da sua empresa.** Assinatura: *Toda receita tem um gargalo. Os dados dizem qual.*
2. **Três linhas, um caminho:** GrowAI Educação (aprender, Framboesa), GrowAI Strategy (organizar, Azul Cobalto), GrowAI Agentes (escalar, Verde Pulso).
3. **O laranja é a cor do foco:** só na marca-mãe, no ponto encontrado e no botão.
4. **Noite para o radar, dia para a leitura.**
5. **Newsreader, Hanken Grotesk e IBM Plex Mono** em tudo; o trecho que importa no título vai em itálico laranja.
6. **Gente de verdade no meio do trabalho**, com a grade Noite, e **o Radar de Foco** como assinatura visual: muitos pontos, um só aceso.

## O que vem na caixa

| Arquivo | O que é |
|---|---|
| `SKILL.md` | O estilo inteiro, travado: essência, arquitetura, cores, tipografia, logo, Radar, fotografia, voz, vocabulário, prova, componentes, aplicações, documentos, pendências e checklist. É o que o Claude lê. |
| `brand-book.html` | **Abra primeiro.** O manual vivo em **8 partes e 44 capítulos** (Fundamentos, Logotipo, Sistema visual, Linguagem, Web e produto, Comunicação, Materiais, Governança): cada capítulo traz a regra, o porquê, a peça em tamanho e proporção reais, os "não faça" e o código para copiar. |
| `deck-template.html` | O esqueleto de **apresentação** em 1440 × 900 com 16 tipos de slide (entre eles foto sangrada, linha do tempo e retrato com depoimento): capa noite com radar, miolo dia, navegação por seta, notas na tecla **P**, cor da linha por `data-linha`. |
| `lockup.html` | Os blocos prontos: logo em arquivo e em data URI, lockups de linha, avatar, favicon, assinatura de e-mail, bio e textos-padrão. |
| `guia-de-uso.html` | Pedidos prontos por público (fundador, time comercial, conteúdo, consultoria, agentes), com o que sai e a seção do manual que manda. |
| `gviz.js` | Motor de gráficos em SVG puro: barras, ranking, linha, composição, anel, funil, fluxo, número, linha do tempo, cota e bowtie. Um destaque laranja por gráfico. |
| `gforms.js` | Motor de formas: o Radar de Foco (animado e parado), anéis, ponto de foco, grade de pontos, caminho das linhas, ciclo do gargalo, ponteiro e sinal. |
| `dist/` | **Para enviar a alguém.** Versões de arquivo único (imagens, fontes e motores embutidos). Abrem sozinhas no WhatsApp, Drive e celular, sem internet. O brand book tem cerca de 14 MB e passa como anexo de e-mail; os outros, cerca de 1 MB. Links de download e para as outras páginas apontam para o endereço público. |
| `autocontido.py` | Gera o `dist/` de novo: `python3 autocontido.py`. Também transforma qualquer HTML novo feito com a skill: `python3 autocontido.py meu-material.html`. |
| `exportar_pdf.py` | Exporta documento ou apresentação em PDF com o Playwright. |
| `assets/` | O logo em SVG e PNG (oficial, claro, preto, branco), o símbolo, os lockups das três linhas, avatar, favicon, imagem de compartilhamento, `marca.json` com medidas e as formas para o Canva (`formas/`). |
| `assets/fotos/` | O banco de fotos aprovado: gente real trabalhando, ambientes por vertical, detalhes, texturas e o retrato do fundador, cada foto em cor tratada (grade Noite) e em monocromático noite (`-duo`). Autor, página e licença em `creditos.json`. |
| `assets/modelos/` | Modelos prontos em tamanho real para Canva e redes: posts de tese, prova e conteúdo, carrossel, story, capa de reels, destaque, banners e capa de artigo do LinkedIn, thumbnail do YouTube e o documento-modelo em PDF. Cada um vem também em versão `-fundo`, para escrever por cima. |
| `catalogo-de-classes.md` | O catálogo das classes da casca (campos, layout, molduras de formato real, componentes): confira a classe aqui antes de usar. |
| `tools/grade.py` | O tratamento de cor das fotos (grade Noite e monocromático noite) e as versões leves de `assets/fotos/web/` (480 e 1200 px). |
| `assets/fontes/`, `assets/icones/` | As fontes embutidas (com `OFL.txt`) e os 15 ícones Lucide do pacote (com `LICENSE-lucide.txt`). |

## Instalar

O nome da pasta tem que ser exatamente `branding-growai`, com o `SKILL.md` dentro.

### Claude Code (terminal, VS Code, app de desktop)

```bash
git clone https://github.com/rafaelnasch/branding-growai.git ~/.claude/skills/branding-growai
```

Abra uma sessão nova e digite `/branding-growai`, ou simplesmente peça "faz no padrão da GrowAI". Para atualizar:

```bash
cd ~/.claude/skills/branding-growai && git pull
```

### Claude no navegador ou no celular (claude.ai)

1. Baixe o ZIP pronto na página de **[Releases](https://github.com/rafaelnasch/branding-growai/releases/latest)**: o arquivo `branding-growai.zip`.
2. No Claude, vá em **Settings, Capabilities, Skills** e envie o ZIP.

> Use o ZIP do Releases, **não** o "Code, Download ZIP" do GitHub: aquele vem com o nome da pasta trocado (`branding-growai-main`) e a skill sobe com o nome errado.

### Codex CLI

```bash
git clone https://github.com/rafaelnasch/branding-growai.git ~/.codex/skills/branding-growai
```

## Enviar um material para alguém

Os HTMLs da pasta principal dependem de `assets/` e dos motores ao lado. Para mandar por e-mail, WhatsApp ou Drive, use a versão de arquivo único:

```bash
python3 autocontido.py                    # refaz dist/ com o brand book, a apresentação, as assinaturas e o guia
                                          # (com Pillow instalado as fotos são recomprimidas: brand book abaixo de 15 MB)
python3 autocontido.py minha-proposta.html  # gera dist/minha-proposta.html
```

## Exportar PDF

```bash
pip install playwright && python3 -m playwright install chromium
python3 exportar_pdf.py deck-template.html
```

No navegador: abra o HTML no Chrome, Imprimir, Salvar como PDF, margens nenhuma, gráficos de fundo ligados.

## Relatórios internos

Relatórios internos feitos pelo gerador da equipe continuam no padrão Editorial de 20/09/2026 (Sora e Source Sans 3) até a migração (pendência P-09 do capítulo 42). Documento novo fora do gerador já sai na tipografia v4, com a página A4 do capítulo 37.

## Versão

**v4 · Radar de Foco, edição completa · outubro de 2026.** Tipografia Editorial (Newsreader, Hanken Grotesk e IBM Plex Mono no lugar de Sora, Source Sans 3 e JetBrains Mono), fotografia documental com pessoas e a grade Noite, e o livro refeito em 44 capítulos. Substitui a v3 (Sora) e a v2.1 "Liquid Glass" (Satoshi e Inter). Aprovado por Rafael Nasch. O logo em vetor é uma reconstrução a partir do PNG original de 7856 px, até o arquivo vetorial original ser localizado.

Fontes: Newsreader, Hanken Grotesk e IBM Plex Mono, todas SIL Open Font License. Ícones: Lucide (ISC). Fotos: licenças Unsplash e Pexels (uso comercial gratuito), com crédito no capítulo 44 e em `assets/fotos/creditos.json`; retrato do fundador de propriedade da GrowAI. Fotos, retrato, fontes e ícones ficam fora da licença CC BY 4.0 do pacote (veja as exceções no `LICENSE`).
