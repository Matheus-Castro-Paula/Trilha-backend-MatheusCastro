const express = require('express');
require('dotenv').config();
const { sequelize } = require('./models');

// Importação de Rotas
const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/produtos');
const clienteRoutes = require('./routes/clientes');
const compraRoutes = require('./routes/compras');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares 
app.use(express.json());

// Definição de Rotas 
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/compras', compraRoutes);

// Rota de Teste
app.get('/', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// Função de Start
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco via Sequelize');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Falha ao conectar:', err);
    process.exit(1);
  }
}

start();