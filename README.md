<div align="center">
  <h1 align="center">
    🚀 Desafio Front-End – React + TypeScript · Aiva
  </h1>
</div>

<div align="center">

![Versão NODE](http://img.shields.io/static/v1?label=v22.14.0&message=%20NODE&color=GREEN&style=for-the-badge)
![Versão NPM](http://img.shields.io/static/v1?label=v10.9.2&message=%20NPM&color=BLUE&style=for-the-badge)
![Versão REACT](http://img.shields.io/static/v1?label=v19.2.7&message=%20REACT&color=PINK&style=for-the-badge)

![TYPESCRIPT](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![REACT](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![VERCEL](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

</div>

## 🎯 Objetivo

- Fluxo de autenticação caso a API suporte (login, registro com uso de token).
- Dashboard principal com listagem, busca e/ou filtros relevantes.
- Operações de CRUD (criar, editar, remover) para pelo menos um recurso-chave.
- Página de detalhe para um item individual.
- Responsividade e feedback visual (loading, estados vazios, erros).

---

## 📋 Pré-requisitos

- Git
- React 19+
- NextJs 15+
- Node.js 20+ e npm
- Visual Studio Code – Editor de código
- Git – Controle de versão
- Postman ou Insomnia – Para testar a Fake Store API

---

## 🔧 Instalação Local

Baixe o projeto no repositório

```bash
git clone https://github.com/leccorside/aiva/
```

Instale as dependências do projeto

```bash
npm install
```

Atualize o arquivo .env com a url da API

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1
```

Rode o projeto

```bash
npm run dev
```

---

## 📦 Framework/Bundler (NEXT.JS)

#### ✅ Por que usar Next.js neste desafio?

Escolhi o Next.js para este projeto por ser um framework moderno que oferece uma estrutura robusta e escalável com suporte nativo a TypeScript, roteamento automático e renderização híbrida (SSR, SSG e CSR). Ele permite otimizar páginas dinamicamente conforme a necessidade, o que é ideal para uma aplicação com páginas públicas (como listagens e detalhes) e privadas (como dashboard autenticado). Além disso, sua integração nativa com ferramentas de performance, SEO, Web Vitals e imagens otimizadas ajuda a entregar uma aplicação pronta para produção desde o início.

Outro ponto decisivo é a excelente experiência de desenvolvimento que o Next.js oferece, com suporte integrado a ESLint, Prettier, testes e CI/CD. Ele se integra facilmente com bibliotecas modernas como React Query, Tailwind CSS, Zustand e Playwright, permitindo que a aplicação atenda com eficiência todos os requisitos do desafio — como CRUD completo, autenticação, responsividade, deploy gratuito e testes automatizados.

---

## 🔐 Funcionalidades

- CRUD Produtos, Usuários e Categorias
- Campo de Pesquisa
- Edição de dados do usuário logado no Perfil
- Níveis de acesso Admin com acesso ao menu "Usuário", e Custumer sem acesso a esse menu.

---

## 👤 Usuário de Teste

email:

```bash
admin@mail.com
```

password:

```bash
admin123
```

---

## 📌 Observações

Para acessar o projeto no Vercel acesse o link abaixo:

```bash
https://leafy-alfajores-eac4ad.netlify.app
```

```bash
https://aiva-kdwyq33sc-johnathans-projects-b4a51b7a.vercel.app/
```

---

## 📌 Teste

Apenas Jest

```bash
npx jest
```

Apenas E2E Playwright

```bash
npx playwright test
```

---

## 📄 Licença

Este projeto está sob a licença MIT.

---
