'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      Rating.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE'
      })
    }
  }
  
  Rating.init({
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    modelName: 'Rating',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'productId'],
        name: 'unique_rating'
      }
    ]
  });

  return Rating;
};