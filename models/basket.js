'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    static associate(models) {
      Basket.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })

      Basket.hasMany(models.BasketProduct, {
        foreignKey: 'basketId',
        as: 'basketProduct',
        onDelete: 'CASCADE'
      })
    }
  }

  Basket.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Basket'
  });

  return Basket;
};