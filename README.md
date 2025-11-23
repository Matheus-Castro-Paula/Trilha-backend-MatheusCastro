# Projeto Loja - Trilha Backend

## API de E-commerce

Este repositório contém o backend de uma loja virtual, desenvolvido como desafio final da trilha de capacitação do processo seletivo da **Comp Júnior**.

O objetivo do projeto foi criar uma API funcional que simula um cenário real de e-commerce, aplicando conceitos de **Docker** para containerização, **MySQL** para persistência de dados e **Node.js** para a construção das rotas e regras de negócio.

---

## Status e Evolução do Projeto

* **Semanas 1-2 (Fundação):** Configuração do ambiente, containerização com Docker e modelagem do Banco de Dados (Migrations e Models).
* **Semana 3 (Segurança):** Implementação de Autenticação JWT, Criptografia de senhas (Bcrypt) e Recuperação de senha por e-mail.
* **Semanas 4-5 (Regras de Negócio):** Desenvolvimento do CRUD completo de Produtos, Clientes e Compras, com controle de acesso (Middleware de Admin vs Usuário).
* **Semana 6 e Entrega Final:** Documentação de todo o projeto, atualizações e conclusão do README.md. 

---

## Tecnologias Utilizadas

* **Runtime:** Node.js & Express.js
* **Banco de Dados:** MySQL 8.0
* **ORM:** Sequelize (para modelagem e queries)
* **Infraestrutura:** Docker & Docker Compose
* **Segurança:** JSON Web Tokens (JWT) & bcrypt.js
* **E-mail:** Nodemailer (SMTP via Mailtrap)

---

## Decisões e Justificativas Técnicas

As tecnologias foram selecionadas para alinhar os **requisitos obrigatórios do desafio** com as melhores práticas de desenvolvimento:

* **Docker:** A containerização **foi um requisito do desafio**, mas também foi fundamental para garantir que o avaliador consiga rodar o projeto (Banco + API) com um único comando, sem problemas de compatibilidade de ambiente.
* **JWT (JSON Web Tokens):** Implementado conforme **solicitado na proposta** para gerenciar a autenticação. É a solução ideal para garantir a segurança dos dois níveis de acesso (Admin e Usuário) sem manter estado no servidor.
* **MySQL & Sequelize:** Como o documento **exigia um banco de dados relacional** persistente, optei pelo MySQL gerenciado pelo ORM Sequelize. Isso facilitou a criação das relações complexas (Clientes, Produtos, Compras) e a manutenção do histórico de tabelas via *Migrations*.
* **Node.js & Express:** Escolhidos para cumprir o objetivo de entregar uma API performática e completa dentro do prazo, aproveitando a vasta documentação e comunidade dessas ferramentas.

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
|   |   # ## Esses arquivos contêm uma numeração (além da data) pois é 
|   |   #    necessária para serem executados na ordem certa 
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

Utilize o Postman ou Insomnia. Importante: Para rotas com Auth = Sim, copie o Token gerado no Login e cole na aba Authorization -> Bearer Token.

### 1. Autenticação (Obter Token)
| Método | URL Completa | Auth | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `http://localhost:3000/api/auth/login` | Não | `{"email": "admin@loja.com", "password": "admin123"}` |
| `POST` | `http://localhost:3000/api/auth/register` | Não | `{"nome_cliente": "Teste", "email_login": "novo@email.com", "password": "123"}` |
| `POST` | `http://localhost:3000/api/auth/forgot` | Não | `{"email": "admin@loja.com"}` |

### 2. Produtos (Gestão da Loja)
| Método | URL Completa | Auth | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:3000/api/produtos` | Não | - |
| `POST` | `http://localhost:3000/api/produtos` | Sim (Admin) | `{"nome_produto": "PC Gamer", "valor_produto": 5000.00, "quantidade_estoque": 10}` |
| `PUT` | `http://localhost:3000/api/produtos/1` | Sim (Admin) | `{"nome_produto": "PC Gamer Editado", "valor_produto": 4500.00, "quantidade_estoque": 5}` |
| `DELETE`| `http://localhost:3000/api/produtos/1` | Sim (Admin) | - |

### 3. Clientes
| Método | URL Completa | Auth | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `http://localhost:3000/api/clientes` | Sim (Admin) | - |
| `POST` | `http://localhost:3000/api/clientes` | Sim (Admin) | `{"nome": "Cliente VIP", "email": "vip@cliente.com", "stats": "ativo"}` |

### 4. Compras
| Método | URL Completa | Auth | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `http://localhost:3000/api/compras` | Sim (Token) | `{"cliente_id": 1, "produto_id": 1, "quantidade_comprada": 1}` |
| `GET` | `http://localhost:3000/api/compras` | Sim (Token) | - |

---

## Autor

Desenvolvido por **Matheus de Castro Paula** como parte do processo seletivo da Comp Júnior.
