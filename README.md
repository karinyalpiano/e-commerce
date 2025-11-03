[![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/USER/REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

# E-commerce Simples (React + Vite)

Projeto de exemplo de loja virtual construído com **React** (Vite) consumindo a **Fake Store API**. Inclui catálogo, filtros, busca, carrinho, favoritos (wishlist) e um **checkout simulado** com máscaras e validações (CEP/CPF/CNPJ/Telefone) e PIX fictício.

> Substitua `USER/REPO` acima pelo caminho do seu repositório no GitHub para ativar o badge de CI.

---

## ✨ Funcionalidades

- 📦 **Catálogo de produtos** com paginação simples
- 🔎 **Busca** por título e **filtros** por categoria e faixa de **preço**
- ↕️ **Ordenação** por preço, título e avaliação
- 🛒 **Carrinho** com persistência em _LocalStorage_
- 💖 **Favoritos (wishlist)** com página dedicada
- 🧾 **Checkout simulado** com:
  - CEP via [ViaCEP](https://viacep.com.br/)
  - Máscaras e validações de CPF/CNPJ/Telefone
  - Opção de **PIX simulado**
- ⭐ **Página de produto** com rating e seleção de quantidade
- 🔁 **Fallback offline** para produtos (quando a API estiver indisponível)
- 🧭 **Breadcrumbs**, estado de carregamento e tratamento de erros
- ✅ **Lint + Build** em CI (GitHub Actions)

---

## 🧰 Stack

- **React 18** + **Vite**
- **React Router v6**
- **Context API**
- **LocalStorage**
- **ESLint**
- **Node.js 20** (`.nvmrc` incluso)
- **Fake Store API**: https://fakestoreapi.com

---

## 🚀 Como rodar localmente

Pré‑requisitos:
- **Node.js 20** (sugestão: `nvm use`)
- **npm**

```bash
# 1) Instale as dependências
npm install

# 2) Ambiente de desenvolvimento
npm run dev

# 3) Build para produção
npm run build

# 4) Pré‑visualização do build
npm run preview

# 5) Lint
npm run lint
```

> URL padrão do dev server (Vite): `http://localhost:5173`

---

## 🗂 Estrutura do projeto (resumo)

```
e-commerce/
├─ .github/workflows/ci.yml     # CI: lint + build
├─ .nvmrc                       # Node 20
├─ index.html
├─ package.json
├─ src/
│  ├─ api/                      # Integração com Fake Store API + fallbacks
│  ├─ components/               # UI (Navbar, ProductCard, Breadcrumbs, etc.)
│  ├─ context/                  # CartContext, FavoritesContext, ToastContext
│  ├─ pages/                    # ProductList, ProductDetail, Cart, Checkout, Orders, Wishlist, NotFound
│  └─ utils/                    # formatadores, máscaras, validações, storage, tema
└─ scripts/
   ├─ bootstrap-repo.sh         # Inicializa repo GitHub e atualiza badges
   └─ bootstrap-repo.ps1
```

---

## 🔌 Integrações

- **Produtos/Categorias**: [Fake Store API](https://fakestoreapi.com)
- **CEP (Checkout)**: [ViaCEP](https://viacep.com.br/)

> O projeto não exige chaves de API. Todas as chamadas externas são públicas.

---

## 🧪 Qualidade & CI

- **ESLint** para padronização do código (`npm run lint`)
- **GitHub Actions** (_workflow_ em `.github/workflows/ci.yml`) executa **install → lint → build** a cada push/PR na branch `main`.

---

## 🛫 Deploy (sugestões)

Qualquer provedor estático que suporte apps Vite (ex.: **Vercel**, **Netlify**, **GitHub Pages**). Em geral, basta:
1. Executar `npm run build` (gera `dist/`).
2. Publicar a pasta `dist/`.

---

## 🧰 Scripts úteis

### Bootstrap do repositório (opcional)
Atualiza automaticamente os *badges* do README trocando `USER/REPO` e faz o primeiro push:

**Linux/macOS**:
```bash
./scripts/bootstrap-repo.sh <usuario-ou-org>/<nome-do-repo>
```

**Windows (PowerShell)**:
```powershell
.\scriptsootstrap-repo.ps1 -Repo "<usuario-ou-org>/<nome-do-repo>"
```

---

## 📌 Roadmap (idéias)
- Autenticação e pedidos reais
- Cálculo de frete e métodos de envio
- Painel administrativo (CRUD de produtos/categorias)
- Testes unitários/E2E

---

## 📝 Licença

Distribuído sob a **MIT License**. Veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.
