const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa o controller

// Rota de Registro (Cria Cliente e User)
router.post('/register', authController.register);

// Rota de Login (Gera Token JWT)
router.post('/login', authController.login);

// Rota para solicitar o e-mail de recuperação
router.post('/forgot-password', authController.forgotPassword);

// Rota para definir a nova senha usando o token
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;