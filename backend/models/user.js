'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
    reset_password_token: { type: DataTypes.STRING, allowNull: true },
    reset_password_expires: { type: DataTypes.DATE, allowNull: true },
    cliente_id: { type: DataTypes.INTEGER, allowNull: true, references: {model: 'cliente', key: 'id'}, 
                  onUpdate: 'CASCADE', onDelete: 'SET NULL' }
  }, {
    tableName: 'user',
    timestamps: true,
    
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.prototype.checkPassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = function(models) {
    User.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
  };

  return User;
};