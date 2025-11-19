# Projeto Loja - Trilha Backend

## API de E-commerce

Este projeto é uma API RESTful robusta para gerenciamento de uma loja virtual, desenvolvida como parte do processo seletivo de trainee da **Comp Júnior**.

O sistema foi construído com foco em escalabilidade, segurança e integridade de dados, utilizando **Node.js**, **Docker** e Banco de Dados Relacional (**MySQL**).

---

## Status e Evolução do Projeto

* **Semanas 1-2 (Fundação):** Configuração do ambiente, containerização com Docker e modelagem do Banco de Dados (Migrations e Models).
* **Semana 3 (Segurança):** Implementação de Autenticação JWT, Criptografia de senhas (Bcrypt) e Recuperação de senha por e-mail.
* **Semanas 4-5 (Regras de Negócio):** Desenvolvimento do CRUD completo de Produtos, Clientes e Compras, com controle de acesso (Middleware de Admin vs Usuário).

---

## Tecnologias Utilizadas

* **Runtime:** Node.js & Express.js
* **Banco de Dados:** MySQL 8.0
* **ORM:** Sequelize (para modelagem e queries)
* **Infraestrutura:** Docker & Docker Compose
* **Segurança:** JSON Web Tokens (JWT) & bcrypt.js
* **E-mail:** Nodemailer (SMTP via Mailtrap)

---

## Modelagem de Dados (Semanas 1-2)

O banco de dados foi estruturado para atender aos requisitos de um e-commerce. As seguintes entidades já estão mapeadas e operacionais no banco:

* **Cliente:** Armazena os dados cadastrais (Nome, CPF, Telefone, etc.).
* **Produto:** Catálogo de itens disponíveis (Nome, Descrição, Preço, Estoque).
* **Compra:** Registra as transações, relacionando Clientes e Produtos.
* **User:** Gerencia o acesso ao sistema (Login, Senha Criptografada e Nível de Acesso).

---

## Estrutura de Pastas

A arquitetura principal do backend está organizada da seguinte forma:

```text
projeto-matheus_castro-trilha-backend/
├── backend/
|   ├── config/  # Configuração de conexão com o Banco
|   |   └── config.js 
|   |
|   ├── controllers/  # Lógica de Negócio
|   |   ├── authController.js
|   |   ├── clienteController.js
|   |   ├── compraController.js
|   |   └── produtoController.js
|   |
|   ├── middleware/  # Protetor de rotas
|   |   └── authMiddleware.js
|   |
|   ├── migrations/   # Migrações do banco (criar tabelas)
|   |   ├── 20251025-1-create-clientes.js 
|   |   ├── 20251025-2-create-compras.js
|   |   ├── 20251025-3-create-produtos.js
|   |   └── 20251101-1-create-users.js
|   |   #
|   |   # ##Esses aquivos contém uma numeração (além da data) pois é 
|   |   #   necessária para serem executados na ordem certa 
|   |
|   ├── models/   # Modelos do Sequelize (cliente, compra, etc.)
|   |   ├── cliente.js
|   |   ├── compra.js
|   |   ├── index.js
|   |   ├── produto.js
|   |   └── user.js
|   |
|   ├── node_modules/ # (Ignorado pelo .gitignore)
|   |
|   ├── routes/  # Endpoints da API
|   |   ├── auth.js
|   |   ├── clientes.js
|   |   ├── compras.js
|   |   └── produtos.js
|   |
|   ├── seeders/  # Scripts para popular banco (Admin padrão)
|   |   └── 20251119-1-create-admin-user.js 
|   |
|   ├── utils/  # Serviços utilitários (Envio de E-mail)
|   |   └── email.js
|   |
|   ├── .env # (Ignorado pelo .gitignore)
|   ├── .env.example  # Exemplo de variáveis de ambiente
|   ├── .gitignore
|   ├── .sequelizerc
|   ├── Dockerfile   # Receita para construir o container do backend
|   ├── package-lock.json
|   ├── package.json
|   └── server.js   # Ponto de entrada da aplicação
|
├── .gitignore
├── docker-compose.yml   # Orquestrador dos serviços (backend + db)
└── README.md   # Este arquivo
```

---

## Como Rodar o Projeto (Para o Supervisor)

**Pré-requisitos:**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
* Um cliente de API (como [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/download)).
* Credenciais de um SMTP de teste (ex: [Mailtrap.io](https://mailtrap.io/)).

**Passo 1: Clonar o Repositório**
```bash
git clone https://github.com/Matheus-Castro-Paula/Trilha-backend-MatheusCastro.git
cd Trilha-backend-MatheusCastro
```

**Passo 2: Configurar o Ambiente**
1.  Navegue até a pasta `backend/`.
2.  Faça uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
3.  Abra o arquivo `.env` e preencha **todas** as variáveis, incluindo as de `JWT_SECRET` e `EMAIL_*` (com suas credenciais do Mailtrap).

**Passo 3: Subir os Containers**
Na pasta **raiz** do projeto (onde está o `docker-compose.yml`), rode:
```bash
docker compose up --build
```

**Passo 4: Criar Usuário Administrador (Seed)**
Para habilitar o login de administrador, execute o comando abaixo (com os containers rodando) para popular o banco de dados:
```bash
docker compose exec backend npx sequelize-cli db:seed:all
```

---

## Credenciais de Teste (Níveis de Usuário)
Para validar o requisito de dois níveis de acesso, utilize os seguintes usuários pré-configurados (certifique-se de ter rodado o Passo 4 acima):

| Nível | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Usuário (Padrão)** | `matheus@teste.com` | `senha123` | Limitado: Pode apenas visualizar produtos e fazer compras. |
| **Administrador** | `admin@loja.com` | `admin123` | Total: Pode criar, editar e excluir Produtos e Clientes. |

---

## Documentação dos Endpoints (API)

Utilize o Postman ou Insomnia. Para rotas que exigem autenticação (Auth = Sim), envie o header: `Authorization: Bearer <SEU_TOKEN_AQUI>`.

### 1. Autenticação (Semana 3)
| Método | Rota | Auth | Body (JSON) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Não | `{"nome_cliente": "Nome", "email_login": "teste@email.com", "password": "123"}` | Cria novo usuário. |
| `POST` | `/api/auth/login` | Não | `{"email": "teste@email.com", "password": "123"}` | Gera o Token JWT. |
| `POST` | `/api/auth/forgot` | Não | `{"email": "teste@email.com"}` | Envia e-mail de recuperação. |

### 2. Produtos (Semana 4 e 5)
| Método | Rota | Auth | Body (JSON) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/produtos` | Não | - | Lista todos os produtos. |
| `POST` | `/api/produtos` | Sim (Admin) | `{"nome_produto": "PC Gamer", "valor_produto": 5000.00, "quantidade_estoque": 10}` | Cadastra produto. |
| `PUT` | `/api/produtos/:id` | Sim (Admin) | `{"nome_produto": "PC Gamer Editado", "valor_produto": 4500.00, "quantidade_estoque": 5}` | Atualiza produto. |
| `DELETE`| `/api/produtos/:id` | Sim (Admin) | - | Remove produto. |

### 3. Clientes (Semana 4 e 5)
| Método | Rota | Auth | Body (JSON) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/clientes` | Sim (Admin) | - | Lista todos os clientes. |
| `POST` | `/api/clientes` | Sim (Admin) | `{"nome": "Cliente Vip", "email": "vip@loja.com", "stats": "ativo"}` | Cria cliente manualmente. |

### 4. Compras (Semana 4 e 5)
| Método | Rota | Auth | Body (JSON) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/compras` | Sim (Token) | `{"cliente_id": 1, "produto_id": 1, "quantidade_comprada": 2}` | Registra uma compra. |
| `GET` | `/api/compras` | Sim (Token) | - | Lista histórico detalhado. |