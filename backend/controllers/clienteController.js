const { Cliente } = require('../models');

module.exports = {
    // Criar Cliente (Admin ou via Registro)
    // Nota: O usuário comum cria isso automaticamente ao se registrar na rota /auth/register.
    // Essa rota aqui serve para um Admin criar um cliente manualmente.
    async store(req, res) {
        try {
            const { nome, email, stats } = req.body;

            const cliente = await Cliente.create({ 
                nome, 
                email, 
                stats: stats || 'ativo' // Se não mandar status, assume ativo
            });

            return res.status(201).json(cliente);
        } catch (err) {
            console.log('ERRO AO CRIAR CLIENTE:', err);
            return res.status(500).json({ error: 'Erro ao criar cliente.' });
        }
    },

    // Listar Todos (Apenas Admin)
    // Proteção de privacidade: Usuário comum não deve ver a lista de todos os clientes.
    async index(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const clientes = await Cliente.findAll();
            return res.status(200).json(clientes);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar clientes.' });
        }
    },

    // Buscar um (Admin)
    async show(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            return res.status(200).json(cliente);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar cliente.' });
        }
    },

    // Atualizar (Admin)
    async update(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const { id } = req.params;
            const { nome, email, stats } = req.body;

            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            await cliente.update({ nome, email, stats });

            return res.status(200).json(cliente);
        } catch (err) {
            console.log('ERRO AO ATUALIZAR:', err);
            return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
            }
    },

    // Deletar (Admin)
    async delete(req, res) {
        try {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const { id } = req.params;
            const cliente = await Cliente.findByPk(id);

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado.' });
            }

            await cliente.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao deletar cliente.' });
        }
    }
};