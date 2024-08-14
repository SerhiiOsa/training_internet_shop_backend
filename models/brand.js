'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: 'brandId',
        as: 'products',
        onDelete: 'SET NULL'
      });

      Brand.belongsToMany(models.Type, {
        through: 'TypeBrand',
        foreignKey: 'brandId',
        otherKey: 'typeId',
        as: 'types'
      });
    }
  }
  
  Brand.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Brand',
  });
  
  return Brand;
};