const { Basket, BasketProduct, Product } = require('../../models');
const { sendData } = require('./utils');
const { accessTokenCookie } = require('../../config');
const jwt = require('jsonwebtoken');

const basketController = {
  async addToBasket(ctx) {
    const { productId } = ctx.request.body;
    const accessToken = ctx.cookies.get(accessTokenCookie.name);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const basket = await Basket.findOne({where: {userId: decoded.id}});
    let addedProduct = await BasketProduct.findOne({where: {basketId: basket.id, productId}});
    if(addedProduct) {
      const error = new Error('The product is already in the basket!');
      ctx.status = 400;
      throw error;
    }
    
    addedProduct = await BasketProduct.create({basketId: basket.id, productId});

    ctx.status = 201;
    ctx.body = {addedProduct};
  },

  async editProductQuantity(ctx) {
    const { productId, quantity } = ctx.request.body;
    const accessToken = ctx.cookies.get(accessTokenCookie.name);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const basket = await Basket.findOne({where: {userId: decoded.id}});
    const editingProduct = await BasketProduct.update({quantity}, {where: {basketId: basket.id, productId}});

    ctx.status = 201;
    ctx.body = {editingProduct};
  },

  async getUserBasket(ctx) {
    const accessToken = ctx.cookies.get(accessTokenCookie.name);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const basket = await Basket.findOne({userId: decoded.id});

    let basketProducts = await BasketProduct.findAll({
      where: {basketId: basket.id},
      include: {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'img', 'brandId', 'typeId', 'rating'],
      },
      attributes: ['quantity']
    })
    
    basketProducts = basketProducts.map(bp => ({...bp.product.toJSON(), quantity: bp.quantity}));

    await sendData(basketProducts, ctx);
  },

  async removeFromBasket(ctx) {
    const { productId } = ctx.request.body;

    const accessToken = ctx.cookies.get(accessTokenCookie.name);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const basket = await Basket.findOne({userId: decoded.id});

    await BasketProduct.destroy({where: {basketId: basket.id, productId}});

    ctx.status = 200;
    ctx.body = {message: 'Product was removed from basket successfuly!'};
  }
}

module.exports = basketController;
