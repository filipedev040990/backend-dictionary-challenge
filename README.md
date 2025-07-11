# 📚 Dictionary API - Back-End Challenge

> API RESTful para um dicionário de palavras com autenticação, histórico e favoritos, utilizando Node.js, Express, MySQL (via Prisma ORM), Redis para cache e Docker para containerização.

This is a challenge by [Coodesh](https://coodesh.com/)

---

## 📌 Descrição

Esta API permite que usuários se cadastrem, façam login, consultem palavras do dicionário, salvem palavras como favoritas e visualizem o histórico de buscas. A aplicação atua como **proxy da [WordsAPI](https://www.wordsapi.com/)**, ou seja, o front-end consome apenas esta API. Conta também com cache de resultados via Redis, paginação, testes unitários e documentação via Swagger.

---

## 🛠 Tecnologias Utilizadas

- **Linguagem:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma ORM
- **Banco de Dados:** MySQL
- **Autenticação:** JWT (JSON Web Token)
- **Cache:** Redis
- **Documentação:** Swagger / OpenAPI 3.0
- **Testes:** Jest
- **Containerização:** Docker + Docker Compose

---

## 🚀 Como Instalar e Rodar o Projeto

### ✅ Pré-requisitos

- [Node.js >= 18.x](https://nodejs.org)
- [Docker e Docker Compose](https://www.docker.com/)
- [Git](https://git-scm.com/)

### 🔧 Etapas de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/filipedev040990/backend-dictionary-challenge.git
cd backend-dictionary-challenge

# 2. Renomeie o arquivo .env.example para .env ajustando o valor das variáveis de ambiente

# 3. Suba os containers da aplicação
make build up logs

# 4. Importe as palavras
[GET] /import-dictionary

🔗 Acessos
API: http://localhost:3000
Documentação Swagger: http://localhost:3000/api-docs


📚 Endpoints da API

🔐 Autenticação
[POST] /auth/signup
Cadastro de novo usuário.

Request:
{
  "name": "User 1",
  "email": "example@email.com",
  "password": "test"
}

Response:
{
  "id": "f3a10cec013ab2c1380acef",
  "name": "User 1",
  "token": "Bearer JWT.Token"
}

[POST] /auth/signin
Login com e-mail e senha.

Request:
{
  "email": "example@email.com",
  "password": "test"
}

Response:
{
  "id": "f3a10cec013ab2c1380acef",
  "name": "User 1",
  "token": "Bearer JWT.Token"
}

📖 Palavras
[GET] /entries/en?search=fire&limit=4
Busca palavras com suporte a filtro e paginação.

Response (paginação por página):
{
  "results": ["fire", "firefly", "fireplace", "fireman"],
  "totalDocs": 20,
  "page": 1,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}

[GET] /entries/en/:word
Retorna detalhes da palavra e salva no histórico.

[POST] /entries/en/:word/favorite
Adiciona uma palavra à lista de favoritas do usuário.

[DELETE] /entries/en/:word/unfavorite
Remove uma palavra da lista de favoritas do usuário.

👤 Usuário
[GET] /user/me
Retorna os dados do usuário autenticado.

[GET] /user/me/history
Retorna a lista de palavras visitadas com paginação.

Response:
{
  "results": [
    { "word": "fire", "added": "2022-05-05T19:28:13.531Z" },
    { "word": "firefly", "added": "2022-05-05T19:28:44.021Z" }
  ],
  "totalDocs": 20,
  "page": 2,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": true
}

[GET] /user/me/favorites
Retorna a lista de palavras favoritas do usuário com paginação.

Response:
{
  "results": [
    { "word": "fire", "added": "2022-05-05T19:30:23.928Z" },
    { "word": "firefly", "added": "2022-05-05T19:30:24.088Z" }
  ],
  "totalDocs": 20,
  "page": 2,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": true
}

🔐 Status HTTP
Código	Descrição
200	Sucesso (com ou sem body)
204	Sucesso sem body
400	Erro com mensagem humanizada

Exemplo de erro:
{
  "message": "Senha inválida"
}

🧠 Cache com Redis
As requisições para a WordsAPI são armazenadas em cache para melhorar a performance. As respostas incluem os seguintes headers:

x-cache: HIT (resposta do cache) ou MISS (resposta nova)

x-response-time: tempo de execução da requisição em milissegundos

📄 Documentação da API
Acesse a documentação gerada com Swagger (OpenAPI 3.0):

http://localhost:3000/api-docs

🧪 Testes
Executar os testes unitários:

npm run test

🐳 Docker
Projeto preparado para uso com Docker e Docker Compose.

Comandos úteis:

# Subir containers
docker-compose up --build

# Derrubar containers
docker-compose down

# Acessar container
docker exec -it dictionary-api-app sh

📂 Estrutura do Projeto

📁 src
 ┣ 📁 controllers              # Controladores que orquestram os casos de uso
 ┃ ┗ 📄 sign-in.controller.ts  # Exemplo de controller com interface genérica
 ┃
 ┣ 📁 domain                   # Regras de negócio puras
 ┃ ┣ 📁 entities               # Entidades do domínio (ex: User, Word)
 ┃ ┗ 📁 interfaces             # Interfaces para usecases, serviços, repositórios
 ┃
 ┣ 📁 infra
 ┃ ┣ 📁 container
 ┃ ┃ ┗ 📄 modules.ts           # Configuração de injeção de dependências (Awilix)
 ┃ ┣ 📁 database
 ┃ ┃ ┗ 📁 repositories         # Implementações concretas de repositórios (ex: MySQL via Prisma)
 ┃ ┣ 📁 http
 ┃ ┃ ┣ 📄 main.ts              # Ponto de entrada da aplicação
 ┃ ┃ ┣ 📄 routes.ts            # Definição das rotas da API
 ┃ ┃ ┣ 📁 middlewares          # Middlewares globais (auth, error handler, logger, cache)
 ┃ ┃ ┣ 📁 schemas              # Validação de payloads com JSON schema
 ┃ ┃ ┣ 📁 tasks                # Tarefas assíncronas (ex: inscrição em canais do Redis)
 ┃ ┃ ┗ 📄 express-route-adapter.ts # Adaptador entre Express e arquitetura desacoplada
 ┃
 ┣ 📁 shared                   # Utilitários, helpers, services comuns
 ┃ ┣ 📄 logger.service.ts      # Serviço de logging padronizado
 ┃ ┗ 📄 helpers.ts             # Funções auxiliares diversas
 ┃
 ┣ 📁 usecases                 # Casos de uso da aplicação
 ┃ ┣ 📄 sign-in.usecase.ts     # Lógica para autenticação de usuário
 ┗