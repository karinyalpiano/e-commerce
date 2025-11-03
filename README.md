[![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/USER/REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

# E-commerce Simples (React)

Projeto de exemplo de loja virtual com produtos da Fake Store API, carrinho e checkout simulado.

## Stack
- React + Vite
- React Router v6
- Context API
- LocalStorage
- Fake Store API: https://fakestoreapi.com

## Funcionalidades
- Lista de produtos com filtro (categoria), busca por título e ordenação (preço/title)
- Carrinho com total
- Checkout simulado (salva pedido no histórico)
- Histórico de pedidos

## Executar
```bash
npm install
npm run dev
```

## Build
```bash
npm run build && npm run preview
```

## Publicar no GitHub

### Opção 1 — Script (Linux/macOS)
```bash
chmod +x scripts/bootstrap-repo.sh
./scripts/bootstrap-repo.sh USER/REPO
```

### Opção 2 — Script (Windows PowerShell)
```powershell
.\scripts\bootstrap-repo.ps1 -Repo "USER/REPO"
```

> Substitua `USER/REPO` pelo caminho do seu repositório (ex.: `prestek-telecom/ecommerce-simples-react`).



## Novidades
- Página de produto com rating e quantidade
- Favoritos (wishlist) com página dedicada
- Filtro por preço (mín/máx) e ordenação por avaliação
- Checkout com CEP (ViaCEP), CPF/CNPJ/Telefone (máscaras/validações) e PIX simulado
