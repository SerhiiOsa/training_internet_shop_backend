'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductInfo extends Model {
    static associate(models) {
      ProductInfo.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      })
    }
  }

  ProductInfo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ProductInfo',
    indexes: [{
      unique: true,
      fields: ['productId', 'title']
    }]
  });

  return ProductInfo;
};