const { Brand } = require('../../models');
const { sendData } = require('./utils');

const brandController = {
  async create(ctx) {
    const {name} = ctx.request.body;
    const brand = await Brand.create({name});

    ctx.status = 201;
    ctx.body = {brand: brand};
  },

  async getAll(ctx) {
    const brands = await Brand.findAll();
    await sendData(brands, ctx);
  },
}

module.exports = brandController;
