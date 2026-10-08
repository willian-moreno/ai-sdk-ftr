# AI SDK

## Pós-graduação em Desenvolvimento Full-Stack com IA — Disciplina: Uso e integração da AI SDK da Vercel

[Sobre](#-sobre) | [Funcionalidades](#-funcionalidades) | [Conceitos](#-conceitos-explorados) | [Estrutura](#-estrutura-do-projeto) | [Tecnologias](#-tecnologias) | [Executando](#-executando-o-projeto) | [Endpoints](#-endpoints)

### 📌 Sobre

Projeto construído durante a disciplina **"Uso e integração da AI SDK da Vercel"** (Fase 2 do cronograma da pós-graduação, turma 03/2026). É uma aplicação de chat com inteligência artificial construída com **Next.js (App Router)** e a **Vercel AI SDK**, utilizando o **OpenRouter** como provedor de modelos — uma única chave de API para acessar diversos modelos de diferentes fornecedores.

A aplicação evoluiu ao longo da aula: partiu de uma geração de texto simples (`generateText`), passou pela geração de dados estruturados (`generateObject` com Zod), chegou ao **Tool Calling** com acesso em tempo real à API do GitHub e finalizou com **streaming de respostas** em uma interface de chat amigável.

### 📌 Funcionalidades

- **Geração de texto** com `generateText`, incluindo `system prompt`;
- **Geração de dados estruturados** com `generateObject` e schema **Zod** — a IA retorna objetos tipados no formato exato definido;
- **Tool Calling** com duas ferramentas:
  - `githubProfile`: busca dados públicos de um usuário do GitHub via **Octokit**;
  - `httpFetch`: realiza requisições HTTP genéricas em uma URL informada;
- **Fluxos agenticos em múltiplos passos** — a IA pode encadear ferramentas (ex.: buscar o perfil do usuário e, com a resposta, descobrir a URL das organizações e fazer uma segunda requisição), com limite de passos via `stopWhen: stepCountIs(...)`;
- **Streaming de respostas** com `streamText` + `useChat` (integração React), usando `DefaultChatTransport` e `createUIMessageStreamResponse`;
- **Renderização de Markdown** nas respostas (react-markdown + remark-gfm + marked), estilizada pelo plugin Typography do Tailwind;
- **Feedback visual durante a execução das tools** — chips de "Carregando informações do GitHub..." / "Realizando requisição HTTP...";
- **UI dinâmica conforme o resultado da tool** — ao buscar um perfil, o chat exibe um card com avatar, nome e bio do usuário do GitHub;
- **Scroll automático** durante o streaming e botão de "voltar ao final" quando o usuário rola para cima;
- Envio de mensagens com **Ctrl/Cmd + Enter** e input desabilitado enquanto a resposta não chega.

### 📌 Conceitos explorados

A disciplina também abordou os **métodos de treinamento/contexto** da IA, úteis para entender quando usar cada recurso:

| Método                        | Quando usar                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Fine Tuning**               | Quando há um conjunto estruturado de perguntas e respostas (FAQ) para alimentar o modelo                                     |
| **Embeddings / Search Based** | Dados em arquivos/documentos (PDFs, transcrições) que podem ser pré-processados e buscados semanticamente                    |
| **Tool Calling**              | Informações em tempo real, sem controle sobre a criação dos dados (APIs, banco de dados, web) — o método usado neste projeto |

### 📌 Estrutura do projeto

```txt
ai-sdk/
├── app/
│   ├── ai/
│   │   ├── open-router.ts            # Instância do provider OpenRouter (createOpenRouter)
│   │   └── tools/
│   │       ├── github-profile.ts     # Tool: perfil público de usuário do GitHub
│   │       ├── http-fetch.ts         # Tool: requisição HTTP genérica
│   │       └── index.ts              # Barrel file + tipagens das tools
│   ├── api/chat/
│   │   ├── simple-text/route.ts      # GET  — geração de texto simples
│   │   ├── object-schema/route.ts    # GET  — dados estruturados (generateObject + Zod)
│   │   ├── tool-calling/route.ts     # GET  — tool calling com 2 passos
│   │   └── stream-text/route.ts      # POST — streaming com tools (consumido pelo useChat)
│   ├── components/
│   │   ├── chat.tsx                  # Chat principal (useChat + renderização de parts/tools)
│   │   ├── chat-header.tsx           # Cabeçalho do chat
│   │   ├── chat-history.tsx          # Histórico de chats (estático, ilustrativo)
│   │   ├── chat-scroll-to-bottom-button.tsx
│   │   ├── github-profile.tsx        # Card com dados do usuário do GitHub
│   │   ├── markdown.tsx              # Renderizador de Markdown otimizado por blocos
│   │   ├── message-input.tsx         # Input de mensagem (textarea + submit)
│   │   ├── sidebar.tsx               # Barra lateral (estática, ilustrativa)
│   │   └── tool-loading.tsx          # Feedback de carregamento das tools
│   ├── lib/octokit.ts                # Instância do Octokit para a API do GitHub
│   ├── env.ts                        # Validação das variáveis de ambiente com Zod
│   ├── layout.tsx                    # Layout root (pt-BR, tema escuro)
│   └── page.tsx                      # Página inicial
├── .env.example                      # Modelo de variáveis de ambiente
└── package.json
```

### 📌 Tecnologias

- Next.js 16 (App Router, React 19);
- TypeScript;
- Vercel AI SDK v7 (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`);
- OpenRouter (`@openrouter/ai-sdk-provider`) — roteador de modelos de IA;
- Zod — validação de schemas e de variáveis de ambiente;
- Octokit (`@octokit/rest`, `@octokit/types`) — API do GitHub tipada;
- Tailwind CSS 4 + plugins Typography e Scrollbar;
- react-markdown, remark-gfm, marked;
- lucide-react (ícones), tailwind-merge;
- pnpm como gerenciador de pacotes.

### 📌 Executando o projeto

**Pré-requisitos:** Node.js, pnpm e uma conta no [OpenRouter](https://openrouter.ai/) com créditos (a chave de API é usada no lugar da chave da OpenAI).

Crie a chave de API em **OpenRouter → Keys** e configure o ambiente:

```powershell
# Instalar dependências
pnpm install

# Criar o arquivo de ambiente a partir do modelo
copy .env.example .env.local
```

Preencha `.env.local` com a sua chave:

```txt
OPEN_ROUTER_API_KEY=sua_chave_aqui
```

Rode o projeto:

```powershell
pnpm dev
```

Acesse `http://localhost:3000` para o chat. As rotas de demonstração ficam em:

#### 📌 Endpoints

```txt
GET  /api/chat/simple-text    → geração de texto simples
GET  /api/chat/object-schema  → objeto estruturado (idioma, palavra, tradução e exemplos)
GET  /api/chat/tool-calling   → tool calling com múltiplos passos
POST /api/chat/stream-text    → streaming usado pela interface de chat
```

> **Nota:** o script `dev` inclui `NODE_TLS_REJECT_UNAUTHORIZED=0`, que desabilita a verificação de certificados TLS. Isso pode ser útil atrás de proxies corporativos, mas **não é recomendado em produção**.

### 📌 Como as ferramentas funcionam

Cada tool é definida com a função `tool()` da AI SDK, contendo:

1. **`description`** — ensina a IA *quando* usar a ferramenta;
2. **`inputSchema`** (Zod) — define e valida os parâmetros de entrada;
3. **`execute`** — a função executada quando a IA invoca a ferramenta.

Na rota de streaming, `stopWhen: stepCountIs(Object.keys(tools).length)` limita a execução a no máximo 2 passos, permitindo que a IA encadeie ferramentas (ex.: `githubProfile` → descobre a URL de organizações → `httpFetch`) antes de responder.

### 📌 Licença

Projeto de estudo desenvolvido para fins educacionais.
