'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Basket, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      User.hasOne(models.RefreshToken, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      User.hasMany(models.Rating, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USER'
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};