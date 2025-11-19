const { Produto } = require('../models');

module.exports = {
    // Criar Produto (Apenas Admin)
    async store(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
            } 

            const { nome_produto, valor_produto, quantidade_estoque } = req.body;

            const produto = await Produto.create({ 
                nome_produto, 
                valor_produto, 
                quantidade_estoque 
            });

            return res.status(201).json(produto);
        } catch (err) {
            console.log('ERRO AO CRIAR PRODUTO:', err);
            return res.status(500).json({ error: 'Erro ao criar produto.' });
        }
    },

    // Listar Todos (Público)
    async index(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.status(200).json(produtos);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar produtos.' });
        }
    },

    // Atualizar (Apenas Admin)
    async update(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const { id } = req.params;
            const { nome_produto, valor_produto, quantidade_estoque } = req.body;

            const produto = await Produto.findByPk(id);
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            await produto.update({ nome_produto, valor_produto, quantidade_estoque });

            return res.status(200).json(produto);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao atualizar produto.' });
        }
    },

    // Deletar (Apenas Admin)
    async delete(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const { id } = req.params;
            const produto = await Produto.findByPk(id);
      
            if (!produto) {
                return res.status(404).json({ error: 'Produto não encontrado.' });
            }

            await produto.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao deletar produto.' });
        }
    }
};