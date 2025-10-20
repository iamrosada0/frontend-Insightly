
# Frontend MVP Plataforma "Insightly"

---

## 🚀 Como Rodar o Frontend Localmente

### 1️⃣ Pré-requisitos

* Node.js >= 18
* npm ou yarn
* Backend NestJS rodando:

  * [Repositório do Backend](https://github.com/iamrosada0/backend-Insightly)
  * URL padrão: `http://localhost:4000`

---

### 2️⃣ Clonar o repositório

```bash
git clone https://github.com/iamrosada0/frontend-Insightly
cd frontend-Insightly
```

---

### 3️⃣ Instalar dependências

```bash
npm install
# ou
yarn install
```

---

### 4️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do frontend com as variáveis necessárias:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> Essa variável define para onde o frontend fará as chamadas à API.

---

### 5️⃣ Scripts disponíveis

No `package.json` estão configurados os seguintes scripts:

| Script  | Descrição                                                                          |
| ------- | ---------------------------------------------------------------------------------- |
| `dev`   | Roda o frontend em modo desenvolvimento (`http://localhost:3000`) usando Turbopack |
| `build` | Compila o frontend para produção usando Turbopack                                  |
| `start` | Roda o frontend compilado em produção                                              |
| `lint`  | Executa o ESLint para checagem de código                                           |

---

### 6️⃣ Rodar em desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

* Acesse `http://localhost:3000` no navegador.
* As páginas públicas são renderizadas via **SSR**.
* As chamadas à API vão para `NEXT_PUBLIC_API_URL`.

---


## 🏢 Estrutura do Projeto Frontend

```
public/                # Assets públicos (imagens, ícones, fontes)
src/
├── app/
│   ├── auth/          # Páginas e rotas de autenticação
│   │   ├── login/     # Página de login
│   │   └── register/  # Página de registro
│   ├── feedbacks/     # Páginas e componentes para feedbacks recebidos pelo usuário
│   ├── profile/       # Páginas de perfil do usuário
│   │   ├── edit/      # Editar informações do perfil
│   │   └── links/     # CRUD de links
│   │       ├── new/   # Criar novo link
│   │       └── [id]/  # Editar link específico
│   │           └── edit/
│   └── [username]/    # Página pública de perfil (SSR)
├── components/        # Componentes React reutilizáveis
│   └── ui/            # Componentes de interface (Botões, Inputs, Cards, Modais)
├── hooks/             # Hooks personalizados do React
├── lib/               # Funções utilitárias, API client, autenticação
└── types/             # Tipagens TypeScript
```

---

## 🔹 Detalhes das Pastas

### `app/`

* Contém **páginas e rotas** principais do Next.js.
* Cada subpasta representa uma rota, seguindo o padrão **App Router** do Next.js 13+.

Exemplos:

* `auth/login` → `/login`
* `profile/edit` → `/profile/edit`
* `[username]` → `/username` (página pública SSR)

---

### `components/`

* Componentes React **reutilizáveis**.
* `ui/` → elementos de interface padrão como Botões, Inputs, Cards, Modais.

---

### `hooks/`

* Hooks personalizados para **state management, fetch de dados e autenticação**.
* Ex.: `useAuth`, `useFetchProfile`, `useFeedbacks`.

---

### `lib/`

* Funções utilitárias e integração com o backend.
* Contém **API client**, helpers para **JWT**, **localStorage**, e validações.

---

### `types/`

* Tipagens TypeScript para **usuário, links, feedbacks e respostas da API**.
* Garante segurança de tipos e autocompletar no VSCode.

---

## 🔹 Como Funciona o Fluxo Frontend

1. **Usuário acessa uma página pública** (`/username`):

   * Next.js usa **SSR** para buscar dados do backend via NestJS API.
   * Renderiza HTML completo com perfil e links.

2. **Usuário logado gerencia perfil**:

   * Pode editar informações (`/profile/edit`) e CRUD de links (`/profile/links/...`).

3. **Envio de feedback anônimo**:

   * Qualquer visitante pode enviar feedback na página pública.
   * Requisição passa pelo **ALB → NestJS → PostgreSQL**.

4. **Hooks e components**:

   * Hooks centralizam lógica de fetch e state.
   * Components reutilizáveis garantem consistência visual.

---

## 🔹 Decisões Estratégicas do Frontend

1. **App Router do Next.js 13+**: separa claramente páginas e layouts.
2. **SSR para páginas públicas**: SEO e carregamento inicial rápido.
3. **Componentização e Hooks**: facilita manutenção e reutilização.
4. **Tipagem TypeScript**: reduz erros e melhora autocompletar.
5. **Pastas claras por feature**: cada rota tem sua própria pasta, mantendo o projeto organizado.

---

