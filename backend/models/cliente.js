module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    stats: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo' },
    cadastrado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'cliente',
    timestamps: false
  });

  Cliente.associate = function(models) {
    Cliente.hasMany(models.Compra, { foreignKey: 'cliente_id' });
    
    Cliente.hasOne(models.User, {
      foreignKey: 'cliente_id',
      as: 'userAccount'
    });
  };

  return Cliente;
};