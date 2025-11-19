const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas (Qualquer um acessa)
// GET /api/produtos -> Lista tudo
router.get('/', produtoController.index);


// Rotas protegidas (Precisa de Token)
// Se não tiver token será barrado
router.use(authMiddleware);

// Controller checa se é admin
// POST /api/produtos -> Cria produto
router.post('/', produtoController.store);

// PUT /api/produtos/:id -> Edita produto
router.put('/:id', produtoController.update);

// DELETE /api/produtos/:id -> Deleta produto
router.delete('/:id', produtoController.delete);

module.exports = router;