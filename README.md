# Projeto Loja - Trilha Backend (Semana 3)

Este projeto é um backend de e-commerce (API RESTful) para um processo seletivo, construído com Node.js, Express, Sequelize e MySQL, e totalmente containerizado com Docker.

Esta versão implementa o sistema completo de autenticação da **Semana 3**, incluindo registro de usuários, login com JSON Web Tokens (JWT) e recuperação de senha por e-mail (via Mailtrap).

---

## Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Banco de Dados:** MySQL (via Sequelize ORM)
* **Containerização:** Docker, Docker Compose
* **Autenticação:** JSON Web Tokens (JWT), bcrypt.js
* **Serviço de E-mail:** Nodemailer (com Mailtrap.io para testes)

---

## 📂 Estrutura de Pastas

A arquitetura principal do backend está organizada da seguinte forma:

```text
projeto-matheus_castro-trilha-backend/
├── backend/
|   ├── config/
|   |   ├──config.js  # Configuração do Sequelize
|   |
|   ├── controllers/
|   |   ├──authController.js
|   |
|   ├── migrations/   # Migrações do banco (criar tabelas)
|   |   ├── 20251025-1-create-clientes.js 
|   |   ├── 20251025-2-create-compras.js
|   |   ├── 20251025-3-create-produtos.js
|   |   ├── 20251101-1-create-users.js
|   |   #
|   |   # ##Esses aquivos contém uma numeração (além da data) pois é 
|   |   #   necessária para serem executados na ordem certa 
|   |
|   ├── models/   # Modelos do Sequelize (cliente, compra, etc.)
|   |   ├── cliente.js
|   |   ├── compra.js
|   |   ├── index.js
|   |   ├── produto.js
|   |   ├── user.js
|   |
|   ├── node_modules/ # (Ignorado pelo .gitignore)
|   |
|   ├── routes/
|   |   ├── auth.js
|   |
|   ├── utils/
|   |   ├── email.js
|   |
|   ├── .env # (Ignorado pelo .gitignore)
|   ├── .env.example  # Exemplo de variáveis de ambiente
|   ├── .gitignore
|   ├── .sequelizerc
|   ├── Dockerfile   # Receita para construir o container do backend
|   ├── package-lock.json
|   ├── package.json
|   ├── server.js   # Ponto de entrada da aplicação
|
├── .gitignore
├── docker-compose.yml   # Orquestrador dos serviços (backend + db)
├── README.md   # Este arquivo
```

---

## Como Rodar o Projeto (Para o Supervisor)

**Pré-requisitos:**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
* Um cliente de API (como [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/download)).
* Credenciais de um SMTP de teste (ex: [Mailtrap.io](https://mailtrap.io/)).

**Passo 1: Clonar o Repositório**
```bash
git clone [URL_DO_SEU_REPOSITORIO_AQUI]
cd projeto-matheus_castro-trilha-backend