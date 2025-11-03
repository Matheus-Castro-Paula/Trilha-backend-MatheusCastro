const { User, Cliente, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Função de Registro
exports.register = async (req, res) => {
  // Dados do Cliente (nome) e do User (email, senha)
  const { nome_cliente, email_login, password } = req.body;

  const t = await sequelize.transaction();

  try {
    // 1. Verifica se o e-mail (User) já existe
    const userExists = await User.findOne({ where: { email: email_login } });
    if (userExists) {
      await t.rollback();
      return res.status(400).json({ error: 'Este e-mail de login já está em uso.' });
    }

    // 2. Cria o Cliente
    const novoCliente = await Cliente.create({
      nome: nome_cliente,
      email: req.body.email_cliente || email_login, // Use um email de cliente ou o de login
      stats: 'ativo'
    }, { transaction: t });

    // 3. Cria o User, ligando-o ao Cliente
    const novoUser = await User.create({
      email: email_login,
      password: password,
      role: 'user', // Clientes registrados são 'user' por padrão
      cliente_id: novoCliente.id // Link para o Cliente
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Usuário e Cliente criados com sucesso!',
      cliente_id: novoCliente.id,
      user_id: novoUser.id
    });

  } catch (err) {
    await t.rollback();
    console.error('Erro no registro:', err);
    res.status(500).json({ error: 'Falha ao registrar usuário.' });
  }
};

// Função de Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Gera o Token JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expira em 7 dias
    );

    res.json({
      message: 'Login bem-sucedido!',
      token
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Falha interna no servidor.' });
  }
};

// Função de Solicitação de Reset de Senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: 'Se o e-mail estiver cadastrado, um link será enviado.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    // Salva o HASH do token no banco, não o token puro
    user.reset_password_token = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Define expiração (10 minutos)
    user.reset_password_expires = Date.now() + 10 * 60 * 1000; 

    await user.save();

    // URL que o usuário vai clicar no e-mail
    const resetURL = `http://localhost:${process.env.PORT || 3000}/api/auth/reset-password/${resetToken}`;

    const message = `
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou uma redefinição de senha.</p>
      <p>Clique neste link para criar uma nova senha (válido por 10 minutos):</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
      <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
    `;

    await sendEmail(user.email, 'Recuperação de Senha', message);

    res.json({ message: 'Se o e-mail estiver cadastrado, um link será enviado.' });

  } catch (err) {
    console.error('Erro no forgotPassword:', err);
    res.status(500).json({ error: 'Erro ao processar solicitação.' });
  }
};

// Função de Resetar a Senha
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'A nova senha é obrigatória.' });
    }

    // Faz o HASH do token da URL para comparar com o do banco
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Procura o usuário pelo token E que não tenha expirado
    const user = await User.findOne({
      where: {
        reset_password_token: hashedToken,
        reset_password_expires: { [require('sequelize').Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    // Define a nova senha
    user.password = password;

    // Limpa os campos de reset
    user.reset_password_token = null;
    user.reset_password_expires = null;

    await user.save();

    res.json({ message: 'Senha redefinida com sucesso!' });

  } catch (err) {
    console.error('Erro no resetPassword:', err);
    res.status(500).json({ error: 'Erro ao redefinir a senha.' });
  }
};