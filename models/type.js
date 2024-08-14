'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      Type.hasMany(models.Product, {
        foreignKey: 'typeId',
        as: 'products',
        onDelete: 'CASCADE'
      });

      Type.belongsToMany(models.Brand, {
        through: 'TypeBrand',
        foreignKey: 'typeId',
        otherKey: 'brandId',
        as: 'brands'
      })
    }
  }

  Type.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Type',
  });

  return Type;
};