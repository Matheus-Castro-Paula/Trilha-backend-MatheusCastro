const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
    // Busca o token
    const authHeader = req.headers.authorization;

    // Verifica se o token existe
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // Limpa o token
    const [, token] = authHeader.split(' ');

    try {
        // Verifica se o token é válido usando o Segredo do .env
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Salva o ID e o Nível do usuário na requisição
        req.userId = decoded.id;
        req.userRole = decoded.role; 

        return next();

    } catch (err) {
        // Se o token for falso ou expirado
        return res.status(401).json({ error: 'Token inválido.' });
    }
};