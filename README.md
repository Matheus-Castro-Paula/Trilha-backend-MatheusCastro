# Projeto Loja - Trilha Backend (Até a Semana 3)

Este projeto é um backend de e-commerce (API RESTful) desenvolvido como parte do processo de trainee da Comp Júnior. O objetivo é construir uma aplicação robusta, escalável e containerizada, evoluindo semana a semana.

### Evolução do Projeto
* **Semanas 1-2:** Configuração do ambiente, Containerização (Docker) e Modelagem do Banco de Dados (Migrations e Models).
* **Semana 3:** Implementação de Segurança (Autenticação, Login JWT, Hash de senhas e Recuperação de senha por e-mail).

---

## Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Banco de Dados:** MySQL (via Sequelize ORM)
* **Containerização:** Docker, Docker Compose
* **Autenticação:** JSON Web Tokens (JWT), bcrypt.js
* **Serviço de E-mail:** Nodemailer (com Mailtrap.io para testes)

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
|   ├── config/
|   |   └──config.js  # Configuração do Sequelize
|   |
|   ├── controllers/
|   |   └──authController.js
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
|   ├── routes/
|   |   └── auth.js
|   |
|   ├── seeders/
|   |   └── 20251119-1-create-admin-user.js  # Permite o acesso de admins 
|   |
|   ├── utils/
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
git clone [URL_DO_SEU_REPOSITORIO_AQUI]
cd projeto-matheus_castro-trilha-backend
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

## Como Testar (Semana 3)

Use o Postman ou Insomnia para testar os endpoints de autenticação.

**1. Registro de Novo Usuário**
Método: POST

URL: http://localhost:3000/api/auth/register

Body (JSON):
```JSON
{
  "nome_cliente": "Seu Nome de Teste",
  "email_login": "seu_email@teste.com",
  "password": "senha123"
}
```

**2. Login**
Método: POST

URL: http://localhost:3000/api/auth/login

Body (JSON):
```JSON
{
  "email": "seu_email@teste.com",
  "password": "senha123"
}
```

Resposta: Você receberá um token JWT.

**3. Solicitar Recuperação de Senha**
Método: POST

URL: http://localhost:3000/api/auth/forgot-password

Body (JSON):
```JSON
{
  "email": "seu_email@teste.com"
}
```

Ação: Verifique sua caixa de entrada do Mailtrap. Você receberá um e-mail com um link contendo o token de reset. Copie o token.

**4. Resetar a Senha**
Método: PATCH

URL: http://localhost:3000/api/auth/reset-password/[COLE_O_TOKEN_DO_MAILTRAP_AQUI]

Body (JSON):
```JSON
{
  "password": "novaSenha456"
}
```

**5. Teste Final: Login com a Nova Senha**
Método: POST

URL: http://localhost:3000/api/auth/login

Body (JSON):
```JSON
{
  "email": "seu_email@teste.com",
  "password": "novaSenha456"
}
```

Resposta: Login deve ser bem-sucedido.

## Credenciais de Teste (Níveis de Usuário)
Para validar o requisito de dois níveis de acesso, utilize os seguintes usuários pré-configurados (certifique-se de ter rodado o Passo 4 acima):

| Nível | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Usuário (Padrão)** | `matheus@teste.com` | `senha123` | Acesso limitado (não pode criar produtos). |
| **Administrador** | `admin@loja.com` | `admin123` | Acesso total (pode criar/editar produtos). |
