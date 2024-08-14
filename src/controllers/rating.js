const { Rating, User, Product } = require('../../models');
const { sendData, assertItemExists } = require('./utils');

const ratingController = {
  async create(ctx) {
    const {rate, productId, userId} = ctx.request.body;

    const user = await User.findOne({where: {id: userId}});
    assertItemExists(user);

    const product = await Product.findOne({where: {id: productId}});
    assertItemExists(product);

    await Rating.upsert({rate, userId, productId});

    const productRates = await Rating.findAll({where: {productId}});
    let totalRate = 0;
    for(let i = 0; i < productRates.length; i++) {
      totalRate += productRates[i].rate;
    }
    const avarageRating = (totalRate / productRates.length).toFixed(1);

    await Product.update({rating: avarageRating}, {where: {id: productId}});

    ctx.status = 201;
    ctx.body = sendData(avarageRating, ctx);
  }
}

module.exports = ratingController;
