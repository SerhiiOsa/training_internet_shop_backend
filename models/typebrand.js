'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TypeBrand extends Model {
    static associate(models) {
    }
  }

  TypeBrand.init({}, {
    sequelize,
    modelName: 'TypeBrand',
    indexes: [{
      unique: true,
      fields: ['typeId', 'brandId']
    }]
  });

  return TypeBrand;
};