const { ProductInfo, sequelize } = require('../../models');
const { sendData } = require('./utils');

const characteristicController = {
  async getAll(ctx) {
    const characteristicTitles = await ProductInfo.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('title')), 'title']
      ],
    });
    const titlesArray = characteristicTitles.map(t => t.title)
    await sendData(titlesArray, ctx);
  },
}

module.exports = characteristicController;
