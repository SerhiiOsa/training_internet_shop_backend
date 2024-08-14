'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Type, {
        foreignKey: 'typeId',
        as: 'type',
        onDelete: 'SET NULL',
      });

      Product.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand',
        onDelete: 'SET NULL'
      });

      Product.hasMany(models.Rating, {
        foreignKey: 'productId',
        as: 'rates',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.ProductInfo, {
        foreignKey: 'productId',
        as: 'info',
        onDelete: 'CASCADE'
      });

      Product.hasMany(models.BasketProduct, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brandId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Brands',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    typeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Types',
        key: 'id'
      },
      onDelete: 'SET NULL'
    }
  }, {
    sequelize,
    modelName: 'Product',
  });

  return Product;
};