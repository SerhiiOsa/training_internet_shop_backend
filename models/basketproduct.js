'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BasketProduct extends Model {
    static associate(models) {
      BasketProduct.belongsTo(models.Basket, {
        foreignKey: 'basketId',
        onDelete: 'CASCADE'
      });

      BasketProduct.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        as: 'product'
      });
    }
  }

  BasketProduct.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    basketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Baskets',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
        as: 'product'
      }
    }
  }, {
    sequelize,
    modelName: 'BasketProduct',
    indexes: [
      {
        unique: true,
        fields: ['basketId', 'productId'],
        name: 'unique_basket_product'
      }
    ]
  });

  return BasketProduct;
};
