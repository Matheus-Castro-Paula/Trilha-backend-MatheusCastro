const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas abaixo precisam de login
router.use(authMiddleware);

router.get('/', clienteController.index); // Listar todos
router.get('/:id', clienteController.show); // Ver um específico
router.post('/', clienteController.store); // Criar manual
router.put('/:id', clienteController.update); // Atualizar
router.delete('/:id', clienteController.delete); // Deletar

module.exports = router;