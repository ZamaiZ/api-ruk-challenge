# API RUK Challenge

API GraphQL desenvolvida para o desafio técnico da [RUK](https://github.com/ruk-tech/desafio-rec). Aplicação full stack de cadastro e listagem de usuários com autenticação JWT.

## 🔗 Links

- **Repositório**: https://github.com/ZamaiZ/api-ruk-challenge
- **Deploy**: https://api-ruk-challenge.onrender.com
- **Frontend**: https://github.com/ZamaiZ/front-ruk-challenge

## 🛠️ Stack

- **NestJS** - Framework Node.js
- **GraphQL** - API com Apollo Server
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação com Jose
- **Argon2** - Hash de senhas
- **TypeScript** - Tipagem estática

## 🏗️ Arquitetura

Projeto segue Clean Architecture com separação de camadas:

```
src/
├── application/      # Casos de uso e portas
├── domain/           # Entidades e DTOs
├── infrastructure/   # Prisma, JWT, Hash
└── presentation/     # Resolvers GraphQL
```

## 📋 Funcionalidades

- **Cadastro (SignUp)**: Cria usuário com nome, email, senha e telefones
- **Login (SignIn)**: Autentica e retorna JWT token
- **Perfil (GetUser)**: Retorna dados do usuário autenticado
- **Listar Usuários**: Paginação e busca por nome/email (autenticado)

## 🚀 Rodando Local

### Requisitos
- Node.js 18+
- Docker e Docker Compose (ou PostgreSQL instalado)
- pnpm

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/ZamaiZ/api-ruk-challenge.git
cd api-ruk-challenge
```

2. Instale as dependências:
```bash
pnpm install
```

3. Suba o banco com Docker:
```bash
docker-compose up -d
```

4. Configure o `.env`:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app?schema=public"
JWT_SECRET="seu_secret_aqui"
```

5. Gere o Prisma Client e execute as migrations:
```bash
pnpm prisma generate
pnpm prisma db push
```

> Ou use `pnpm prisma migrate dev` para criar/aplicar migrations

6. Rode em desenvolvimento:
```bash
pnpm start:dev
```

A API estará em `http://localhost:3000/graphql`

## 🔌 Integração

O frontend React Native/Expo consome esta API via GraphQL. Exemplo de query:

```graphql
mutation SignIn {
  signIn(input: { email: "teste@email.com", password: "senha123" }) {
    token
  }
}

query GetUser {
  getUser {
    id
    name
    email
    telephones {
      number
      area_code
    }
  }
}
```

## 📦 Deploy

Deploy automático no Render via `render.yaml`. Database e web service provisionados automaticamente.

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e
```
