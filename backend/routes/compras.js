const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege todas as rotas
router.use(authMiddleware);

router.post('/', compraController.store); // Registrar compra
router.get('/', compraController.index);  // Ver histórico completo
router.get('/:id', compraController.show); // Ver detalhes de uma
router.delete('/:id', compraController.delete); // Cancelar

module.exports = router;