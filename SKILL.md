---
name: branding-growai
description: "A identidade da GrowAI no sistema Radar de Foco v3: o laranja #FF6A1A como cor do foco (só marca-mãe, ponto encontrado e botão), três linhas com cor própria (GrowAI Educação em Framboesa, GrowAI Strategy em Azul Cobalto, GrowAI Agentes em Verde Pulso), noite para o radar e dia para a leitura, Sora nos títulos, Source Sans 3 no texto, JetBrains Mono nos números, o logo atual em vetor, o Radar de Foco como assinatura visual, imagem sem pessoas, voz que afirma e fala de negócio com o dono, vocabulário próprio e proibido, regras de prova, componentes, gráficos (gviz) e formas (gforms). Use para QUALQUER material da GrowAI: site, Raio-X do Negócio, proposta, apresentação, relatório, documento de consultoria, portal Strategy, painel, post, carrossel, capa, e-mail, assinatura e WhatsApp. Não use para peças de cliente (cada cliente tem a própria marca). Triggers: branding growai, padrão growai, marca growai, radar de foco, identidade growai."
---

# /branding-growai · A identidade da GrowAI

Um estilo de casa travado, chamado **Radar de Foco**. A GrowAI é **o sistema de foco da sua empresa**: conecta os dados do negócio, encontra o ponto que trava o crescimento e concentra tudo nele até o ponteiro mexer. A marca faz o mesmo em cada peça: **muitos pontos neutros, um só ponto laranja.** Assinatura: **Toda receita tem um gargalo. Os dados dizem qual.**

Palavras-guia: clara, direta, segura, provocativa sem arrogância, de dono para dono. Nunca: agência, "só um sistema", técnica demais, hype, promessa sem prova, pessoa gerada por IA.

**Abra PRIMEIRO:** [`brand-book.html`](brand-book.html), o manual em 28 seções com a regra e a regra funcionando. O `<head>` e a `<style>` dele são o template portátil de **página e documento**. Para **apresentação**, use [`deck-template.html`](deck-template.html). Os motores vivem em [`gviz.js`](gviz.js) (dados) e [`gforms.js`](gforms.js) (radar e formas). Logos em arquivo e em data URI, assinatura de e-mail, bio e blocos prontos estão em [`lockup.html`](lockup.html). Pedidos prontos por público estão em [`guia-de-uso.html`](guia-de-uso.html). Medidas da marca em [`assets/marca.json`](assets/marca.json).

---

## Onde a skill roda

| Ambiente | Onde instalar | O que muda |
|---|---|---|
| **Claude Code** (terminal, VS Code, desktop) | `~/.claude/skills/branding-growai` | Nada. Escreve arquivo, usa `assets/`, exporta PDF. |
| **Codex CLI** | `~/.codex/skills/branding-growai` | Nada. |
| **claude.ai** (navegador e celular) | Settings › Capabilities › Skills (ZIP do Releases) | **O artefato é um arquivo só: não enxerga `assets/` nem os `.js`.** |

**REGRA DO NAVEGADOR (claude.ai):** todo HTML gerado ali é autocontido. Logo pelos blocos em **data URI** do `lockup.html` (copie o `src` inteiro, nunca digite ou resuma um data URI). Motores colados num `<script>` do próprio arquivo. Fontes pelo link do Google Fonts. PDF: entregue o HTML e mande imprimir pelo Chrome.

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
- **Um só laranja por composição** além do logo: o ponto de foco OU o botão OU o destaque do título. Nunca laranja como fundo de seção.
- **Saem:** Satoshi, Inter, Liquid Glass (vidro, brilho, orbe), roxo e azul de "tecnologia" nas capas antigas, degradê fora do "g", neon.

## Noite e dia (TRAVADO)

**Noite para o radar, dia para a leitura.** Noite = impacto e monitoramento: primeira dobra, capa, abertura de capítulo, painel, aviso de agente, post de tese, avatar, vídeo. Dia = leitura e explicação: resto do site, miolo de apresentação, proposta, relatório, documento, aula, Raio-X, post de prova. A troca marca capítulo, nunca parágrafo. Ritmo padrão de página: abre na noite, explica no dia, fecha na noite. `body` sempre com background explícito.

## Tipografia (TRAVADA)

```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Papel | Fonte | Regra |
|---|---|---|
| Títulos | **Sora** 500 (display e título) e 600 (subtítulo, card) | letter-spacing −0,02 a −0,045em nos grandes; entrelinha 1,0 a 1,1; um trecho no máximo em laranja |
| Texto | **Source Sans 3** 400 e 600 | 18 px no desktop, 17 no celular, entrelinha 1,6; até 70 caracteres por linha |
| Números e rótulos | **JetBrains Mono** 400 e 500 | número que é assunto; rótulo em caixa alta 11–12 px com 0,12–0,14em |

Escala: display 64–92 · título 1 44/32 · título 2 28/24 · subtítulo 21/20 · texto 18/17 · apoio 15 · rótulo 12. Itálico só em citação e termo estrangeiro. Caixa alta só em rótulo mono. Número no formato brasileiro (1.250 · 44,5% · R$ 231 mil).

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
- **`deck-template.html`** · 13 tipos de slide (capa, agenda, capitulo, afirmacao, numero, grafico, compara, caminho, ciclo, citacao, proposta, passo, fim). `<body data-linha="strategy">` troca a cor de identificação; sem o atributo, é a marca-mãe. Setas navegam, **P** abre as notas, **F** tela cheia, `#N` abre o slide N.
- SVGs prontos para Canva em `assets/formas/`.

**Regras de gráfico:** título que afirma ("A receita trava na proposta"), um destaque laranja, fonte e data no rodapé, dizer se é medido, derivado ou estimado, ausência de dado não vira zero, barras do zero, sem 3D e sem pizza com mais de quatro fatias.

## Imagem e ícones

**Sem pessoas.** Imagem = tela real do Strategy ou dos agentes (dado de exemplo marcado), diagrama, Radar, número grande, captura de conversa do agente com dados pessoais apagados. **Nunca:** banco de imagem, rosto ou pessoa gerada por IA, "executivo diante de gráficos brilhantes", cérebro, robô, circuito, raio azul, dado real de cliente sem autorização escrita. O lado humano mora na voz.

Ícones **Lucide**, traço 1,5–2 px, sem preenchimento, cor de apoio; laranja só no ícone do foco. 16–18 px em lista, 20–24 px em destaque, 32–40 px em abertura. Nada de emoji em peça pública (em relatório interno, ✅ ⚠️ ❌ são aceitos para escanear).

## Voz e tom (TRAVADOS)

Referência: "Sua receita tem um gargalo. Os dados dizem qual. Sem trocar o time. Sem começar pela ferramenta." Consultiva na estrutura, provocativa nas frases curtas.

1. **Afirmar, não prometer.** "Tem um gargalo", não "podemos te ajudar a crescer".
2. **Falar de negócio com o dono.** Nunca "operação" ou "operacional" com ele. Receita, margem, time, decisão.
3. **Recusar em voz alta.** "Sem trocar o time." A recusa é promessa e filtro.
4. **Desarmar.** "Se o gargalo não for de sistema, a gente fala."

Tom por leitor: dono (negócio, decisão, coragem) · líder (funil, ritmo, meta) · operador (tarefa, tempo, próximo passo) · mercado (tese, provocação, prova). Voz por linha: Educação didática e generosa · Strategy sóbria e exata · Agentes concreta e viva. Primeira pessoa do plural para a GrowAI, "você" para o leitor. Frases curtas, entendidas de primeira. **No máximo dois travessões numa página longa e nenhum em título.**

**Palavras nossas:** gargalo · mover o ponteiro · foco · sistema de foco · negócio · receita · decisão · clareza · destravar · número · agentes · **RevOps AI Native** (nome do método: marketing, vendas e pós-venda como uma só operação, com dado único e IA de ponta a ponta) · **GTM Engineering** (nome do topo de Agentes: a máquina de demanda operada por agentes). Os dois nomes próprios vêm explicados na primeira menção ao dono; "RevOps" e "GTM" soltos não entram no texto principal.

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

`.btn` (um por tela, laranja, texto escuro, verbo no começo) · `.selo-linha.edu|.str|.age` · `.restricao` (o gargalo do ciclo, antes de qualquer número) · `.aviso` (rótulo com hora, frase, número, ação) · `.kpi` e `.kpi.foco` · `.cita` · `.pill.sim|.at|.nao` · `.card`, `.cadeia`, `.linha-card`. Todos funcionam em `.campo-noite` e `.campo-dia` (os campos definem as variáveis `--f-*`). Código pronto na seção 17 do brand book.

## Aplicações (ordem de prioridade aprovada)

1. **Site institucional:** primeira dobra noite com Radar, categoria em rótulo, título = assinatura, uma frase, um botão (Fazer o Raio-X do Negócio). Sete blocos: abertura, o caos em números, o ciclo, o caminho, prova, quem não é cliente, fechamento.
2. **Raio-X do Negócio:** linha Educação (Framboesa), base clara, perguntas sobre o negócio, cadastro libera o resultado completo, resultado com UMA dimensão em laranja, entrega por WhatsApp com convite ao Diagnóstico do Gargalo.
3. **Proposta e apresentação:** `deck-template.html`. Capa noite com radar em recorte e faixa da linha; miolo dia, uma ideia por slide. Sequência: capa · o que o cliente disse · o gargalo com número · custo de não mudar · a frente única · métrica, meta e prazo · investimento (`[investimento]` enquanto não houver preço) · próximo passo.
4. **Documentos e relatórios:** ver "Documentos internos" abaixo.
5. **Portal Strategy e painéis:** endereço da linha, Azul Cobalto como principal; restrição antes dos números; um indicador em laranja; dentro do portal, ferramenta de terceiro é só "CRM".
6. **Redes sociais:** post noite para tese, dia para prova; uma frase por peça; número de prova na cor da linha. Post 1080 × 1350 · story 1080 × 1920 · LinkedIn 1584 × 396.
7. **E-mail, assinatura e WhatsApp:** avatar = "g" sobre noite; assinatura com traço laranja, nome, papel e a categoria.

## Documentos internos e relatórios (padrão Editorial)

Relatórios HTML internos, diagnósticos e documentos de consultoria continuam no **GrowAI Editorial** aprovado em 20/09/2026 (assinatura técnica `v7-forecast`), que já está alinhado a este sistema: fundo branco, logo oficial, Sora 600 nos títulos, Source Sans 3 no corpo, coluna única com sumário após a introdução, tabelas neutras. No clone `growaura-3`: template `.claude/templates/aura-report-template.html`, logo `.claude/templates/growai-forecast-logo-snippet.html`, responsivo `.claude/templates/growai-responsive-script.html`, gerador `python3 tools/render_report.py arquivo.md` e validador `python3 .claude/lib/report-html/validate.py arquivo.html`. **Acréscimos do Radar de Foco:** rótulo do documento na cor de texto da linha; restrição ativa antes de qualquer tabela; laranja só na conclusão que pede ação; nome sempre GrowAI. A aprovação do padrão não substitui conferir cada documento renderizado no desktop e no celular.

**Slides oficiais do Forecast** (Google Slides do GTM Forecast Kit) mantêm o design nativo deles. Não redesenhe esses arquivos.

**Páginas de cliente** (landing page, VSL, aplicação de um cliente) usam a marca do cliente, nunca esta.

## Grade e celular

Largura máxima 1200 px · margem 56/16 · calha 32/16 · espaço entre seções 128/72 · raio 14 (cartão) e 20 (bloco). De 320 a 430 px nada sai da tela: grades empilham, tabelas largas ganham rolagem própria sinalizada, botão quebra linha, Radar sobe e diminui. Proibido `overflow-x:hidden` global para esconder layout quebrado.

## Exportar PDF

`python3 exportar_pdf.py arquivo.html` (Playwright). No claude.ai: abrir o HTML no Chrome › Imprimir › Salvar como PDF, margens nenhuma, gráficos de fundo ligados.

## Pendências (não resolva por conta própria)

1. Arquivo vetorial original do logo (usar a reconstrução).
2. Três provas de cliente aguardando confirmação.
3. Perguntas e pontuação do Raio-X do Negócio.
4. Autorização para citar clientes pelo nome.
5. Preço de cada degrau da esteira (usar `[investimento]`).

## Checklist de aprovação de peça

- [ ] Afirma em vez de prometer, fala de negócio com o dono, número com fonte.
- [ ] Nenhuma palavra proibida; no máximo dois travessões e nenhum em título.
- [ ] Produto numa só linha; cor de linha só identifica; nome GrowAI.
- [ ] Nenhuma ferramenta como produto; nenhuma conversa gratuita.
- [ ] Um só ponto laranja e um só botão; laranja do botão com texto escuro.
- [ ] Só Sora, Source Sans 3 e JetBrains Mono; sem pessoas e sem banco de imagem.
- [ ] Noite para impacto, dia para leitura.
- [ ] Legível de 320 a 430 px, sem corte.

## Gotchas

- Branco sobre o laranja falha no contraste: o botão leva `#170A02`.
- Verde Pulso base (`#12A877`) não serve para texto em fundo claro (3,1:1): use `#0B7A56`.
- O logo em fundo de cor de linha só na versão branca.
- O Radar em PDF e slide sai parado: confira que o ponto laranja está aceso.
- Em peça para o claude.ai, nunca digite um data URI: copie do `lockup.html`.
- Materiais de marca antigos (v6 Liquid Glass, capas roxas, propostas de identidade não aprovadas) não são referência: só este pacote vale.

## O que o Radar de Foco NÃO é

Não é tema escuro de tecnologia, não é vidro, não é neon, não é foto de executivo, não é laranja em tudo, não é pilha de ferramentas com logo. É uma tela calma com um ponto aceso.
