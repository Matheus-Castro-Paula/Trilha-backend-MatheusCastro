const { Compra, Cliente, Produto } = require('../models');

module.exports = {
    // Registrar compra (Admin ou Usuário)
    async store(req, res) {
        try {
            const { cliente_id, produto_id, quantidade_comprada } = req.body;

            // Validação básica produto
            const produto = await Produto.findByPk(produto_id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            // Validação básica cliente
            const cliente = await Cliente.findByPk(cliente_id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            // Validação de estoque
            const compra = await Compra.create({
                cliente_id,
                produto_id,
                quantidade_comprada: quantidade_comprada || 1 // Se não mandar, assume 1
            });

            return res.status(201).json(compra);
        } catch (err) {
            console.log('ERRO AO COMPRAR:', err);
            return res.status(500).json({ error: 'Erro ao registrar compra.' });
        }
    },

    // Listar todas as compras (Admin)
    async index(req, res) {
        try {
            // Traz os dados das tabelas relacionadas
            const compras = await Compra.findAll({
                include: [
                    { model: Cliente, attributes: ['nome', 'email'] }, // Traz nome do cliente
                    { model: Produto, attributes: ['nome_produto', 'valor_produto'] } // Traz nome do produto
                ]
            });
      
            return res.status(200).json(compras);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao buscar histórico de compras.' });
        }
    },

    // Buscar alguma compra específica
    async show(req, res) {
        try {
            const { id } = req.params;
            const compra = await Compra.findByPk(id, {
                include: [
                    { model: Cliente },
                    { model: Produto }
                ]
            });

            if (!compra) {
                return res.status(404).json({ error: 'Compra não encontrada.' });
            }

            return res.status(200).json(compra);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar compra.' });
        }
    },

    // Deletar compra (Estorno/Cancelamento)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const compra = await Compra.findByPk(id);

            if (!compra) {
                return res.status(404).json({ error: 'Compra não encontrada.' });
            }

            await compra.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao cancelar compra.' });
        }
    }
};