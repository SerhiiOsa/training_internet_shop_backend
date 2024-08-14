const { Type, TypeBrand } = require('../../models');
const { sendData, toPluralUkrainianWords } = require('./utils');

const typeController = {
  async create(ctx) {
    const {name} = ctx.request.body;
    const type = await Type.create({name});

    ctx.status = 201;
    ctx.body = {type: type};
  },

  async getAll(ctx) {
    let types = await Type.findAll();
    types = types.map(t => {
      return {
        ...t.toJSON(),
        nameInPlural: toPluralUkrainianWords(t.name)
      }
    })
    const typeBrands = await TypeBrand.findAll();

    await sendData({types, typeBrands}, ctx);
  },
}

module.exports = typeController;
