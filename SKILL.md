---
name: branding-growai
description: "Identidade da GrowAI (sistema Radar de Foco v4). Laranja #FF6A1A só no foco (marca-mãe, ponto encontrado, botão); três linhas com cor própria: GrowAI Educação (Framboesa), Strategy (Azul Cobalto), Agentes (Verde Pulso); noite para o radar, dia para a leitura; Newsreader nos títulos com itálico laranja do foco, Hanken Grotesk no texto, IBM Plex Mono nos números; logo atual em vetor; fotografia documental com grade Noite; voz que afirma e fala de negócio com o dono; regras de prova; componentes web, modelos de redes, deck, gráficos (gviz) e formas (gforms). Use para qualquer material da GrowAI: site, Raio-X do Negócio, proposta, apresentação, relatório, portal Strategy, post, story, anúncio, e-mail, assinatura, cartão, evento, WhatsApp. Não use em peças de cliente. Triggers: branding growai, padrão growai, marca growai, radar de foco."
---

# /branding-growai · A identidade da GrowAI

Um estilo de casa travado, chamado **Radar de Foco**. A GrowAI é **o sistema de foco da sua empresa**: conecta os dados do negócio, encontra o ponto que trava o crescimento e concentra tudo nele até o ponteiro mexer. A marca faz o mesmo em cada peça: **muitos pontos neutros, um só ponto laranja.** Assinatura: **Toda receita tem um gargalo. Os dados dizem qual.**

Palavras-guia: clara, direta, segura, provocativa sem arrogância, de dono para dono. Nunca: agência, "só um sistema", técnica demais, hype, promessa sem prova, rosto gerado por IA.

**Abra PRIMEIRO:** [`brand-book.html`](brand-book.html), o manual em **8 partes e 44 capítulos** com a regra, o porquê, a peça em tamanho real, os "não faça" e o código para copiar. O `<head>` e a `<style>` dele são o template portátil de **página e documento** (o catálogo de classes está em [`catalogo-de-classes.md`](catalogo-de-classes.md): confira a classe lá antes de usar). Para **apresentação**, use [`deck-template.html`](deck-template.html). Os motores vivem em [`gviz.js`](gviz.js) (dados) e [`gforms.js`](gforms.js) (radar e formas). Logos em arquivo e em data URI, assinatura de e-mail, bio e blocos prontos estão em [`lockup.html`](lockup.html). Pedidos prontos por público estão em [`guia-de-uso.html`](guia-de-uso.html). Medidas da marca em [`assets/marca.json`](assets/marca.json). Fotos aprovadas em [`assets/fotos/`](assets/fotos/) (créditos em `creditos.json`) e modelos prontos para redes em [`assets/modelos/`](assets/modelos/).

**Mapa do brand book (para citar o capítulo certo):** I Fundamentos 01 Manifesto · 02 Essência · 03 Princípios e recusas · 04 Quem compra · 05 Arquitetura de marca. II Logotipo 06 Anatomia e construção · 07 Versões e cores do logo · 08 Respiro, tamanhos e posição · 09 Lockups de linha e co-branding · 10 Usos incorretos · 11 Logo em movimento. III Sistema visual 12 Cor · 13 Tipografia · 14 Noite e dia · 15 Radar de Foco · 16 Grafismos e padrões · 17 Iconografia · 18 Fotografia · 19 Ilustração e diagramas · 20 Dados e gráficos · 21 Movimento. IV Linguagem 22 Voz e tom · 23 Vocabulário · 24 Prova e promessa · 25 Escrita por canal. V Web e produto 26 Design system web · 27 Páginas modelo · 28 Portal Strategy e painéis · 29 Acessibilidade e celular. VI Comunicação 30 Instagram · 31 LinkedIn · 32 YouTube e vídeo · 33 WhatsApp · 34 Anúncios · 35 E-mail e newsletter. VII Materiais 36 Apresentações e propostas · 37 Documentos e relatórios · 38 Papelaria · 39 Eventos e ambientes · 40 Kit de marca. VIII Governança 41 Migração · 42 Pendências · 43 Checklist de aprovação · 44 Versões e créditos. Âncora de cada capítulo: `brand-book.html#cap-NN`.

---

## Onde a skill roda

| Ambiente | Onde instalar | O que muda |
|---|---|---|
| **Claude Code** (terminal, VS Code, desktop) | `~/.claude/skills/branding-growai` | Nada. Escreve arquivo, usa `assets/`, exporta PDF. |
| **Codex CLI** | `~/.codex/skills/branding-growai` | Nada. |
| **claude.ai** (navegador e celular) | Settings › Capabilities › Skills (ZIP do Releases) | **O artefato é um arquivo só: não enxerga `assets/` nem os `.js`.** |

**REGRA DO NAVEGADOR (claude.ai):** todo HTML gerado ali é autocontido. Logo pelos blocos em **data URI** do `lockup.html` (copie o `src` inteiro, nunca digite ou resuma um data URI). Motores colados num `<script>` do próprio arquivo. Fontes pelo link do Google Fonts. Foto: só o que o pedido trouxer anexado ou o link público do arquivo no GitHub Pages (`https://rafaelnasch.github.io/branding-growai/assets/fotos/...`); nunca foto de outra origem. PDF: entregue o HTML e mande imprimir pelo Chrome.

**Para ENVIAR um HTML a alguém:** `python3 autocontido.py <arquivo.html>` grava em `dist/` com imagens, fontes e motores embutidos.

## Essência (TRAVADA)

| Peça | Texto |
|---|---|
| Categoria (para ser lembrado) | **O sistema de foco da sua empresa.** "Sistema" é jeito de operar, não software. |
| Descrição de apoio (para ser encontrado) | Consultoria de RevOps com IA. Só em busca, perfil e primeira explicação. |
| Assinatura | Toda receita tem um gargalo. Os dados dizem qual. |
| Inimigo | O caos: achismo, dado espalhado, cada um fazendo o que quer, líder no escuro, esforço gasto no sintoma. |
| Propósito | Fazer empresas decidirem com clareza o que realmente move o ponteiro. |
| Promessa | Clareza para decidir, coragem para crescer. |
| Síntese | Foco é a nossa tecnologia. |

**Os quatro princípios:** dado antes de opinião · um gargalo por vez · processo antes de automação · sem distração, de ponta a ponta.

**Recusas públicas:** não começamos sem dado · uma frente por vez · não automatizamos o caos · o método não se negocia.

**Quem não é cliente:** quem quer crescer no achismo, manter tudo manual ou implementar tudo ao mesmo tempo.

**Quem compra:** o dono ou sócio de empresa de R$ 3 a 20 milhões por ano, com time comercial, que virou o gargalo da própria empresa. Duas portas: "parou de crescer e não sei por quê" (entregar clareza) e "cresci e perdi o controle" (entregar foco e controle). **Nunca ser lido como** agência, "só um sistema" ou "algo técnico": a GrowAI aparece sempre como a soma de método, sistema e gente.

## Arquitetura de marca (TRAVADA)

Marca-mãe **GrowAI** + três linhas, sempre na ordem **aprender → organizar → escalar**. Cada produto pertence a UMA linha.

| Linha | Papel | Esteira (entrada → topo) |
|---|---|---|
| **GrowAI Educação** | aprender: o cliente aprende o método e aplica | Raio-X do Negócio, checklists, masterclass gratuita (grátis com cadastro) → treinamentos gravados, masterclass paga → **formações em turma** |
| **GrowAI Strategy** | organizar: a GrowAI organiza a receita com o cliente (núcleo) | Diagnóstico do Gargalo (pago, abatido) → **consultoria RevOps AI Native + sistema Strategy** → Strategy sem consultoria |
| **GrowAI Agentes** | escalar: Agent as a Service | um agente → malha de agentes → **GTM Engineering** |

- **Sem conversa gratuita.** A porta de entrada é o **Raio-X do Negócio** (com cadastro). Depois, o **Diagnóstico do Gargalo**, pago. Nunca escreva "consultoria gratuita", "sessão estratégica grátis" ou "conversa sem compromisso".
- **Ninguém pula o diagnóstico** para chegar ao núcleo ou aos Agentes.
- **Ingredientes não são produto:** CRM, central de dados, ClickUp, Claude, Codex e qualquer ferramenta de terceiro ficam dentro do Strategy ou servem de base aos Agentes. Nunca aparecem como produto. Critério: órgão, não vitamina (o produto fica no caminho da receita do cliente).
- **Verticais não ganham cor:** Agências, Educação, Saúde, E-commerce mudam exemplo, modelo e número de referência.
- **A cor segue o endereço:** growai.com.br e materiais da mãe = neutros (~80%) + laranja (~10%) + cores de linha (~10%, só no trecho de cada linha). Página ou endereço de uma linha (strategy.growai.com.br, hub da Educação, painel dos Agentes) = cor da linha como principal; logo e botão continuam laranja.

## Cores (TRAVADAS)

| Token | Nome | HEX | Uso |
|---|---|---|---|
| `--foco` | Laranja Foco | `#FF6A1A` | marca-mãe, ponto de foco, botão. **Só no que importa.** |
| `--foco-titulo-dia` | Laranja Título | `#D9530C` | itálico de título no dia, de 24 px para cima (4,04:1 no branco). Na noite o itálico é `#FF6A1A` |
| `--foco-txt` | Laranja texto | `#B33E0A` | link, rótulo e destaque de texto sobre claro (5,8:1) |
| `--foco-noite` | Laranja na noite | `#FF8A4C` | texto laranja sobre noite (8,3:1) |
| `--foco-btn-txt` | Texto do botão | `#170A02` | sempre o texto do botão laranja (6,8:1). **Nunca branco sobre laranja (2,9:1).** |
| `--edu` · `--edu-txt` · `--edu-bg` · `--edu-noite` | Framboesa | `#D63A7A` · `#A82259` · `#FCEAF2` · `#FF8DB8` | GrowAI Educação |
| `--str` · `--str-txt` · `--str-bg` · `--str-noite` | Azul Cobalto | `#2F5BEA` · `#1E3FB8` · `#EAF0FF` · `#8FA8FF` | GrowAI Strategy |
| `--age` · `--age-txt` · `--age-bg` · `--age-noite` | Verde Pulso | `#12A877` · `#0B7A56` · `#E5F7EF` · `#3DDC9F` | GrowAI Agentes |
| `--noite` · `--noite-2` · `--noite-linha` | Noite | `#0B0D12` · `#141821` · `#232936` | fundo, superfície, linha do escuro |
| `--noite-txt` · `--noite-apoio` | | `#EEF1F5` · `#9AA3B2` | texto e apoio sobre noite |
| `--dia` · `--dia-2` · `--dia-linha` | Dia | `#FFFFFF` · `#F6F7F8` · `#E4E7EB` | fundo, superfície, linha do claro |
| `--dia-txt` · `--dia-apoio` | | `#0C0F14` · `#4A525E` | texto e apoio sobre claro |
| `--bom` · `--atencao` · `--critico` | Situação | `#0B7A56` · `#B54708` · `#B42318` | só painel, relatório e aviso, sempre com rótulo escrito |

- **Base para área, texto para palavra:** a cor base de cada linha pinta faixa, selo, ícone e gráfico; palavra usa a variação `-txt` (no claro) ou `-noite` (no escuro). Branco sobre Framboesa base só em texto grande ou negrito (4,4:1). Verde Pulso base leva texto `#0C0F14`.
- **Um só laranja de foco por composição**, além do logo: o ponto aceso do radar OU a barra do gargalo OU o itálico do título. O botão de ação é o único laranja que pode conviver com ele; quando a peça tem botão, o itálico do título fica na cor do texto. Nunca laranja como fundo de seção.
- **Saem:** Sora, Source Sans 3 e JetBrains Mono (v3), Satoshi e Inter (v2), Liquid Glass (vidro, brilho, orbe), roxo e azul de "tecnologia" nas capas antigas, degradê fora do "g", neon.
- **Impressão:** as equivalências CMYK do capítulo 12 são aproximadas e vão marcadas "a validar em prova". Peça prova de cor à gráfica antes de qualquer tiragem.

## Noite e dia (TRAVADO)

**Noite para o radar, dia para a leitura.** Noite = impacto e monitoramento: primeira dobra, capa, abertura de capítulo, painel, aviso de agente, post de tese, avatar, vídeo. Dia = leitura e explicação: resto do site, miolo de apresentação, proposta, relatório, documento, aula, Raio-X, post de prova. A troca marca capítulo, nunca parágrafo. Ritmo padrão de página: abre na noite, explica no dia, fecha na noite. `body` sempre com background explícito.

## Tipografia (TRAVADA · v4 Editorial)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Papel | Fonte | Regra |
|---|---|---|
| Display e títulos | **Newsreader** (variável, eixo óptico 6–72, `font-optical-sizing:auto`) | 400 no display grande (48 px ou mais), 500 em título de seção e de cartão; letter-spacing −0,02em no grande; entrelinha 0,98 a 1,1 |
| O itálico do foco | **Newsreader Italic** em `<em>` | o trecho que importa no título vai em itálico laranja: `#FF6A1A` na noite; `#D9530C` no dia em título de 24 px ou mais; `#B33E0A` no dia abaixo de 24 px. Nunca `#FF6A1A` em texto sobre o claro (2,87:1). **Um trecho por título, no máximo.** Se a peça já tem outro ponto laranja (número, gráfico, radar), o itálico fica na cor do texto |
| Texto, interface, botão, legenda | **Hanken Grotesk** 400, 500 e 600 | 18 px no desktop, 17 no celular, entrelinha 1,6; até 70 caracteres por linha |
| Números, rótulos, dados, código | **IBM Plex Mono** 400 e 500 | número que é assunto; rótulo em caixa alta 11–12 px com 0,12–0,14em |

Tokens: `--ff-display` Newsreader · `--ff-texto` Hanken Grotesk · `--ff-mono` IBM Plex Mono. Escala web: mega 140–380 (número de abertura) · hero 46–124 · d1 42–104 · d2 34–68 · d3 26–42 · h4 21–26 · h5 19 · lead 19–23 · corpo 18/17 · pequeno 15,5 · micro 13,5 · rótulo 11,5. Na peça de 1080 px nada fica abaixo de 24 px (capítulo 13.6). Caixa alta só em rótulo mono. Número no formato brasileiro (1.250 · 44,5% · R$ 231 mil).

**Sem internet:** Georgia (display), Arial ou Helvetica (texto), Courier New (números). Em e-mail, o nome na assinatura usa Georgia.

**Saíram na v4:** Sora, Source Sans 3 e JetBrains Mono. Não use em peça nova.

## O logo (TRAVADO)

O logo atual continua: "growai" em letras grossas, o "g" em degradê laranja (anel em cima, arco aberto embaixo: o radar que encontrou o ponto). Os SVGs de `assets/` são a **reconstrução vetorial** a partir do PNG original de 7856 px (o arquivo vetorial original ainda é pendência). O logo é **sempre um arquivo**: nunca redigite, recolora, estique, gire, contorne ou aplique efeito.

| Arquivo | Uso |
|---|---|
| `growai-logo-oficial.svg` | fundo claro (padrão de site, documento e proposta) |
| `growai-logo-claro.svg` | fundo escuro (capa, primeira dobra, vídeo) |
| `growai-logo-preto.svg` · `growai-logo-branco.svg` | uma cor (impressão, sobre tela, sobre cor de linha: só a branca) |
| `growai-simbolo-oficial.svg` (+ branco, preto) | abaixo de 32 px, favicon, marca d'água |
| `growai-avatar.svg` (+ PNG 1080 e 640) | perfil de rede, WhatsApp, e-mail |
| `growai-favicon.svg` (+ PNG 32, 180, 512) | navegador e app |
| `growai-linha-educacao-dia.svg` (e strategy, agentes; dia ou noite) | logo + filete + nome da linha |
| `growai-compartilhamento-1200x630.png` | imagem de link (og:image) |

Respiro: altura do "o" nos quatro lados. Mínimo: 80 px na tela, 22 mm impresso. **Nome no texto: sempre GrowAI.** Nunca Growai, GrowAi, Grow AI. O logo nunca muda de cor para acompanhar a linha.

## O Radar de Foco (assinatura visual)

Uma varredura passa por muitos pontos (os dados do negócio) e acende **um** em laranja (o gargalo). Partes: anéis e eixos finos em cinza de baixa opacidade · pontos de dado cinza que acendem com a varredura · feixe com rastro laranja suave, **uma volta a cada 6 s** · UM ponto de foco laranja com pulso lento · aviso curto (rótulo mono, uma frase, o número). Versões: animado (site, portal, vídeo), parado com o ponto aceso (slide, post, impresso, `prefers-reduced-motion`), recorte (um quarto do radar saindo pela borda). **Nunca:** dois pontos laranja, radar com cores de linha, neon, varredura rápida, radar que não encontra nada.

## Motores

Inclua com `<script src="gviz.js"></script><script src="gforms.js"></script>` (ou colados, no claude.ai). Renderizam sozinhos os elementos com data-atributo; leem o fundo real para escolher a paleta (noite ou dia).

- **`gviz.js`** · `<div data-gviz='{"tipo":"barras","rotulos":[...],"valores":[...],"destaque":2,"fonte":"...","data":"..."}'></div>` (ou `gviz.barras(el, opts)`). Tipos: `barras` e `ranking` (`rotulos`, `valores`, `vrotulos`), `linha` (+ `area`, `referencia:{valor, rotulo}`), `composicao` (`segmentos`), `anel` (`valor` 0–100), `funil` (`etapas:[{rotulo, valor}]`, `taxas`), `fluxo` (`passos`), `numero` (`valor`, `vrotulo`, `rotulo`, `sub`, `serie`), `linha-tempo` (`eventos`), `cota`, `bowtie` (`valores` de M1 Lead a M8 Expansão, `taxas:true`, `gargalo`: índice da etapa em laranja). Comuns: `campo` (`noite`|`dia`, padrão = fundo real), `linha` (`educacao`|`strategy`|`agentes`, cor da série), `destaque` (o único laranja), `sobretitulo`, `titulo` (que afirma), `fonte` e `data` (obrigatórios; sem fonte sai "Dado ilustrativo · fonte a informar"). `gviz.svg(el)` exporta; `gviz.animar = false` desliga a entrada. API completa no cabeçalho do arquivo.
- **`gforms.js`** · `<div data-gforms="radar" data-gforms-opts='{"foco":{"angulo":-54,"raio":0.56},"aviso":{"rotulo":"Gargalo encontrado","texto":"..."}}'></div>`. Formas: `radar` (canvas animado; `pontos`, `semente`, `foco`, `aviso`, `leitura`; 1 volta a cada 6 s; parado em impressão e com movimento reduzido; pausa fora da tela), `radar-svg` (parado, para slide e impresso), `aneis`, `ponto`, `grade`, `caminho` (`atual`: 0 a 2, o "você está aqui"), `ciclo` (`foco`: padrão Focar), `ponteiro` (`valor`, `vrotulo`, `zona:[de, ate]`, `rotulo`), `sinal` (`rotulo`, `texto`). Todas aceitam `campo`, `linha` e `aria`. `gforms.svg(nome, opts)` exporta. API completa no cabeçalho do arquivo.
- **`deck-template.html`** · 16 tipos de slide em 1440 × 900: capa, agenda, capitulo, **foto** (foto sangrada com título), afirmacao, numero, grafico, compara, caminho, ciclo, **tempo** (linha do tempo), citacao, **retrato** (retrato com depoimento), proposta, passo, fim. Títulos em Newsreader com o itálico do foco; fotos de `assets/fotos/` (sem a foto, o slide cai para o fundo noite com grade de pontos). `<body data-linha="strategy">` troca a cor de identificação; sem o atributo, é a marca-mãe. Setas navegam, **P** abre as notas, **F** tela cheia, `#N` abre o slide N.
- SVGs prontos para Canva em `assets/formas/` (radar, anéis, grade de pontos, ponto de foco, caminho, ciclo; noite e dia).
- **Modelos prontos em `assets/modelos/`** (PNG em tamanho real; cada um tem a versão `-fundo`, só com fundo, grade e logo, para escrever por cima no Canva): `post-tese-1080x1350`, `post-prova-1080x1350`, `post-conteudo-1080x1350`, `carrossel-capa-1080x1350`, `carrossel-sinal-1080x1350`, `story-1080x1920`, `capa-reels-1080x1920`, `destaque-1080x1920`, `linkedin-banner-1584x396`, `linkedin-pagina-1128x191`, `linkedin-artigo-1920x1080`, `youtube-thumb-1280x720` e o `linkedin-documento-modelo.pdf` (carrossel em documento). As fontes HTML dos modelos ficam com a equipe de marca; para mudar um modelo, peça a ela.

**Regras de gráfico:** título que afirma ("A receita trava na proposta"), um destaque laranja, fonte e data no rodapé, dizer se é medido, derivado ou estimado, ausência de dado não vira zero, barras do zero, sem 3D e sem pizza com mais de quatro fatias.

## Fotografia (TRAVADA · v4)

**Fotografia documental de gente real trabalhando de verdade.** A regra "sem pessoas" da v3 caiu. Quem aparece: donos e donas de empresa brasileira (35 a 55 anos), líderes comerciais, times pequenos, operadores com celular e notebook; diversidade real do Brasil. Ambientes: escritório de PME, depósito de e-commerce, clínica, sala de curso ou estúdio, agência, balcão, café. Capítulo 18.

- **Momento antes da decisão:** a pessoa olha a tela, confere o papel, conversa, pensa. Nunca pose para a câmera, aperto de mão, "executivo sorrindo para gráfico brilhante", holograma, cérebro, robô.
- **Luz natural, lateral, contraste médio.** Luz de janela, nunca de estúdio.
- **Tratamento de cor "grade Noite":** sombras puxadas para o azul-noite `#0B0D12`, meios-tons dessaturados em cerca de 25%, realces neutros e um único elemento quente puxado para o laranja. Duas versões de cada foto: **cor tratada** (`nome.jpg`) e **monocromático noite** (`nome-duo.jpg`, duotone `#0B0D12` → `#EEF1F5`) para fundo de capa com texto por cima. Classes `.foto.trat-cor` e `.foto.trat-mono`; script [`tools/grade.py`](tools/grade.py) trata foto nova e gera as versões leves de `assets/fotos/web/` (480 e 1200 px).
- **Foto com texto:** o texto mora no vazio da foto (parede, céu, sombra), nunca sobre rosto, mão ou tela; véu de azul-noite na base quando precisar.
- **Banco aprovado:** só as fotos de `assets/fotos/` que `creditos.json` não marca como fora do banco (49 cenas hoje, em seis categorias: dono, time, operador, ambiente, detalhe, textura, mais o retrato do fundador). Licenças Unsplash e Pexels (uso comercial gratuito); crédito no capítulo 44. **Fora do banco** (não use; os arquivos saíram da pasta pública e ficam listados só em texto no capítulo 44): `dono-cafe-telefone`, `dono-balcao-loja`, `time-quadro-giz`, `time-mesa-redonda`, `ambiente-ecommerce-etiqueta`, `ambiente-clinica-consulta`, `ambiente-clinica-dentista`, `ambiente-clinica-fisio`, `ambiente-barbearia`.
- **Paciente, criança ou pessoa identificável sem autorização** não entra. Marca de terceiro legível na cena também não.
- **Retrato do fundador:** `rafael-nasch.jpg` (cor tratada), `rafael-nasch-duo.jpg` e `rafael-nasch-noite.jpg` (recorte 4:5). É a única foto que olha para a câmera. O arquivo tem 560 × 700 px: não use acima de 400 px de lado (telão, slide de retrato e crachá esperam o ensaio próprio, P-08).
- **Foto de banco nunca passa por cliente** nem ilustra resultado de cliente: prova de cliente leva o número, o segmento e o período, com imagem de detalhe sem rosto ou nenhuma imagem. Imagem gerada por IA só para textura ou abstrato, **nunca rosto**.
- **Telas e interface** continuam valendo como imagem de produto: tela real do Strategy ou dos agentes, com dado de exemplo marcado e dados pessoais apagados. Dado real de cliente nunca sem autorização escrita.

## Ícones

Ícones **Lucide**, grade de 24 px, traço 1,5–2 px, sem preenchimento, cor de apoio; laranja só no ícone do foco. Três ícones próprios: radar, ponto de foco e gargalo (capítulo 17). 16–18 px em lista, 20–24 px em destaque, 32–40 px em abertura. Nada de emoji em peça pública (em relatório interno, ✅ ⚠️ ❌ são aceitos para escanear).

## Voz e tom (TRAVADOS)

Referência: "Sua receita tem um gargalo. Os dados dizem qual. Sem trocar o time. Sem começar pela ferramenta." Consultiva na estrutura, provocativa nas frases curtas.

1. **Afirmar, não prometer.** "Tem um gargalo", não "podemos te ajudar a crescer".
2. **Falar de negócio com o dono.** Nunca "operação" ou "operacional" com ele. Receita, margem, time, decisão.
3. **Recusar em voz alta.** "Sem trocar o time." A recusa é promessa e filtro.
4. **Desarmar.** "Se o gargalo não for de sistema, a gente fala."

Tom por leitor: dono (negócio, decisão, coragem) · líder (funil, ritmo, meta) · operador (tarefa, tempo, próximo passo) · mercado (tese, provocação, prova). Voz por linha: Educação didática e generosa · Strategy sóbria e exata · Agentes concreta e viva. Primeira pessoa do plural para a GrowAI, "você" para o leitor. Frases curtas, entendidas de primeira. **No máximo dois travessões numa página longa e nenhum em título.**

**Palavras nossas:** gargalo · mover o ponteiro · foco · sistema de foco · negócio · receita · decisão · clareza · destravar · número · agentes · **RevOps AI Native** (nome do método: marketing, vendas e pós-venda funcionando como um só time, com dado único e IA de ponta a ponta) · **GTM Engineering** (nome do topo de Agentes: a máquina de demanda operada por agentes). Os dois nomes próprios vêm explicados na primeira menção ao dono; "RevOps" e "GTM" soltos não entram no texto principal.

| Evitar | Usar |
|---|---|
| solução, ferramenta | sistema de foco, método |
| implementação, entregáveis | resultado, ponteiro, meta |
| transformação digital, disruptivo, revolucionar | o resultado, com número |
| 10x, garantido, escalar fácil, sem esforço | o caso real, com o segmento |
| robô, bot, chatbot | agente |
| operação (com o dono) | negócio |
| consultoria gratuita, conversa sem compromisso | Raio-X do Negócio |
| Growai, GrowAi, Grow AI | GrowAI |

## Prova e promessa (TRAVADO)

Resultado de cliente só medido, com período e **segmento no lugar do nome** ("e-commerce de embalagens"); nome e frase de cliente só com autorização escrita. "Até 10x" e "garantido" são vedados até existir caso medido. Antes e depois de faturamento nunca em título de anúncio. Dado pessoal de cliente final nunca aparece (LGPD). Número de exemplo sempre marcado como exemplo. Prova liberada hoje: **num e-commerce de embalagens, a fatia de oportunidades que vira venda passou de 4,7% para 10,3% em oito meses.** Os demais resultados aguardam confirmação: não use.

## Componentes canônicos

`.btn` (um por tela, laranja, texto escuro, verbo no começo) · `.selo-linha.edu|.str|.age` · `.restricao` (o gargalo do ciclo, antes de qualquer número) · `.aviso` (rótulo com hora, frase, número, ação) · `.kpi` e `.kpi.foco` · `.cita` · `.pill.sim|.at|.nao` · `.cartao` (`.cartao.foco`, `.cartao.limpo`) · `.lista` · `.tabela-wrap` + `.tab`. Todos funcionam em `.campo-noite`, `.campo-dia` e `.campo-dia-2` (os campos definem as variáveis `--f-*`). Botões, campos, cartões, navegação, tabelas, avisos, KPIs, abas, modais, estados e foco de teclado, com código, no capítulo 26. Molduras de formato real (`.m-post`, `.m-story`, `.m-banner`, `.m-thumb`, `.m-slide`, `.m-a4`, `.m-cartao`, `.m-navegador`, `.m-celular`) em [`catalogo-de-classes.md`](catalogo-de-classes.md). Confira cada classe no catálogo antes de usar: classe que não está lá sai sem estilo.

## Aplicações (ordem de prioridade aprovada)

1. **Site institucional** (cap. 27): primeira dobra noite com Radar, categoria em rótulo, título = assinatura, uma frase, um botão (Fazer o Raio-X do Negócio). Sete blocos: abertura, o caos em números, o ciclo, o caminho, prova, quem não é cliente, fechamento.
2. **Raio-X do Negócio** (cap. 27): linha Educação (Framboesa), base clara, perguntas sobre o negócio, cadastro libera o resultado completo, resultado com UMA dimensão em laranja, entrega por WhatsApp com convite ao Diagnóstico do Gargalo.
3. **Proposta e apresentação** (cap. 36): `deck-template.html`. Capa noite com radar em recorte e faixa da linha; miolo dia, uma ideia por slide. Sequência: capa · o que o cliente disse · o gargalo com número · custo de não mudar · a frente única · métrica, meta e prazo · investimento (`[investimento]` enquanto não houver preço) · próximo passo.
4. **Documentos e relatórios** (cap. 37): ver "Documentos internos" abaixo.
5. **Portal Strategy e painéis** (cap. 28): endereço da linha, Azul Cobalto como principal; restrição antes dos números; um indicador em laranja; dentro do portal, ferramenta de terceiro é só "CRM".
6. **Redes sociais e vídeo** (cap. 30 a 32): post noite para tese, dia para prova, foto do banco para conteúdo; uma frase por peça; número de prova na cor da linha. Post 1080 × 1350 · story e capa de reels 1080 × 1920 (zonas seguras de 250 px no topo e 340 px na base) · banner LinkedIn 1584 × 396 · página LinkedIn 1128 × 191 · thumbnail 1280 × 720 (um rosto real, até cinco palavras, um laranja). Comece pelos modelos de `assets/modelos/`.
7. **Anúncios** (cap. 34): Meta feed 4:5 e stories 9:16, LinkedIn e Google display; sem "10x", "garantido" nem antes e depois de faturamento no título; botão sempre para o Raio-X do Negócio.
8. **E-mail, assinatura e WhatsApp** (cap. 33, 35, 38): avatar = "g" sobre noite; assinatura com traço laranja, nome, papel e a categoria; newsletter em uma coluna de 600 px.
9. **Papelaria e eventos** (cap. 38, 39): cartão 85 × 55 mm (frente noite, verso dia), A4, envelope DL, crachá, telão 16:9, backdrop, credencial, sinalização de sala; PDF com 3 mm de sangria e cores CMYK a validar em prova.

## Documentos internos e relatórios (padrão Editorial)

Relatórios internos feitos pelo gerador da equipe continuam no padrão Editorial de 20/09/2026 (Sora e Source Sans 3) até a migração (pendência P-09): documento gerado por ele continua válido. Documento novo feito fora do gerador já sai na tipografia v4 (Newsreader, Hanken Grotesk, IBM Plex Mono), com a página A4 do capítulo 37. **Acréscimos do Radar de Foco:** rótulo do documento na cor de texto da linha; restrição ativa antes de qualquer tabela; laranja só na conclusão que pede ação; nome sempre GrowAI. A aprovação do padrão não substitui conferir cada documento renderizado no desktop e no celular.

**Slides oficiais do Forecast** (Google Slides do GTM Forecast Kit) mantêm o design nativo deles. Não redesenhe esses arquivos.

**Páginas de cliente** (landing page, VSL, aplicação de um cliente) usam a marca do cliente, nunca esta.

## Grade e celular

Contêiner 1240 px (1480 no largo, 720 na coluna de leitura) · margem 16–72 px · calha 16–32 px · grade de 12 colunas · espaçamento 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192 · raios 4, 8, 12, 16, 24 · sombra só no dia (na noite vira fio). Pontos de quebra 1600, 1100, 760 e 420. De 320 a 430 px nada sai da tela: grades empilham, tabelas largas ganham rolagem própria sinalizada ("Deslize a tabela para o lado →"), botão quebra linha, Radar sobe e diminui, área de toque de 44 × 44 px. `prefers-reduced-motion` corta animação e deixa o radar parado com o ponto aceso. Proibido `overflow-x:hidden` global para esconder layout quebrado. Capítulos 26 e 29.

## Exportar PDF

`python3 exportar_pdf.py arquivo.html` (Playwright). No claude.ai: abrir o HTML no Chrome › Imprimir › Salvar como PDF, margens nenhuma, gráficos de fundo ligados.

## Pendências (não resolva por conta própria)

Lista viva no capítulo 42. Enquanto aberta, a peça usa colchete (`[investimento]`, `[nome do cliente]`), nunca um valor inventado.

1. P-01 · Arquivo vetorial original do logo (usar a reconstrução de `assets/`).
2. P-02 · Três provas de cliente aguardando confirmação (usar só a prova liberada).
3. P-03 · Perguntas e pontuação do Raio-X do Negócio.
4. P-04 · Autorização para citar clientes pelo nome (usar o segmento).
5. P-05 · Preço de cada degrau da esteira (usar `[investimento]`).
6. P-06 · Cores em impressão: CMYK a validar em prova.
7. P-07 · Mínimo impresso do símbolo (não imprimir abaixo de 6 mm; em dúvida, logo completo com 22 mm ou mais).
8. P-08 · Ensaio próprio com clientes e time, com termo de imagem (até lá, só o banco de `assets/fotos/`).
9. P-09 · Relatórios internos com a tipografia v4 (o gerador Editorial de 20/09 segue valendo).

## Checklist de aprovação de peça

- [ ] Afirma em vez de prometer, fala de negócio com o dono, número com fonte.
- [ ] Nenhuma palavra proibida; no máximo dois travessões e nenhum em título.
- [ ] Produto numa só linha; cor de linha só identifica; nome GrowAI.
- [ ] Nenhuma ferramenta como produto; nenhuma conversa gratuita.
- [ ] Um só laranja de foco (ponto, barra ou itálico) e um só botão; com botão, o itálico fica na cor do texto; laranja do botão com texto escuro.
- [ ] Só Newsreader, Hanken Grotesk e IBM Plex Mono; um itálico laranja por título, no máximo.
- [ ] Foto só do banco aprovado, com a grade Noite; ninguém posando, nenhum rosto gerado por IA, foto de banco nunca como cliente nem ao lado de prova de cliente.
- [ ] Noite para impacto, dia para leitura.
- [ ] Peça no formato real (1080 × 1350, 1080 × 1920, 1584 × 396, 1280 × 720, 85 × 55 mm, A4, 16:9), com texto dentro da área segura.
- [ ] Legível de 320 a 430 px, sem corte. Checklist completo de 25 itens no capítulo 43.

## Gotchas

- Branco sobre o laranja falha no contraste: o botão leva `#170A02`.
- Verde Pulso base (`#12A877`) não serve para texto em fundo claro (3,1:1): use `#0B7A56`.
- O logo em fundo de cor de linha só na versão branca.
- O Radar em PDF e slide sai parado: confira que o ponto laranja está aceso.
- Em peça para o claude.ai, nunca digite um data URI: copie do `lockup.html`.
- O itálico laranja do título conta como o laranja de foco da peça: se já há botão, número, gráfico ou radar com ponto aceso, o `<em>` fica na cor do texto.
- Texto sobre foto só no vazio da cena e com véu; branco sobre parede clara ninguém lê.
- Foto marcada como fora do banco em `creditos.json` não volta para peça nova, mesmo que o arquivo continue na pasta.
- Materiais de marca antigos (v6 Liquid Glass, capas roxas, peças da v3 em Sora, propostas de identidade não aprovadas) não são referência: só este pacote vale. A migração está no capítulo 41.

## O que o Radar de Foco NÃO é

Não é tema escuro de tecnologia, não é vidro, não é neon, não é foto de executivo posando, não é laranja em tudo, não é pilha de ferramentas com logo, não é site com cara de feito por IA. É uma página de editor, com gente de verdade, uma tela calma e um ponto aceso.
