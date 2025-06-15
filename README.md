# Backend - NestJS

## Visão Geral

Backend construído com NestJS e TypeScript, responsável pela lógica de negócio, persistência de dados, autenticação, integrações e comunicação em tempo real.

---

## Tecnologias principais

- Node.js
- NestJS
- TypeScript
- PostgreSQL (via TypeORM ou Prisma)
- Redis (cache, filas e pub/sub)
- JWT para autenticação
- BullMQ para filas assíncronas
- WebSockets

---

## Configuração do Banco de Dados

- PostgreSQL como banco principal.
- ORM: TypeORM ou Prisma.
- Use migrations para versionamento do esquema.
- Redis para cache e filas (BullMQ).

---

## Autenticação

- JWT para autenticação segura.

---

## Filas e Cache

- Redis para cache e filas assíncronas via BullMQ.

---

## Executando localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente (`.env`) para banco, Redis e JWT.
4. Execute as migrations:
   ```bash
   npm run typeorm:migration:run
   ```
5. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```
6. Acesse `http://localhost:3000`

---

## Qualidade de código

- Husky + lint-staged configurados para pré-commit.
- ESLint e Prettier aplicados automaticamente.

---

## Testes

- Utilize Jest para testes.
- Execute:
  ```bash
  npm run test
  ```

---

## Documentação da API

- Swagger disponível em `/api` (durante o desenvolvimento).

---

## Deploy e Infraestrutura

- Preparado para deploy em nuvem (AWS, GCP, Azure).
- Uso de serviços gerenciados para banco, cache e filas.
- CI/CD automatizado (GitHub Actions).

---

## Contato

Entre em contato com a equipe de backend para dúvidas.