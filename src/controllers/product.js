const path = require("path");
const { Product, ProductInfo, TypeBrand } = require('../../models');
const { sendData, removeImage, assertItemExists } = require('./utils');

const productController = {
  async create(ctx) {
    let {name, price, brandId, typeId, info} = ctx.request.body;
    let img = ctx.files.img;
    img = `img/products/${path.basename(img[0].destination)}/${img[0].filename}`;

    const product = await Product.create({name, price, brandId, typeId, img});

    await TypeBrand.upsert({typeId, brandId});

    if(info) {
      info = JSON.parse(info);
      info.forEach(i => {
        ProductInfo.create({
          title: i.title,
          description: i.description,
          productId: product.id
        })
      });
    }
  
    ctx.status = 201;
    ctx.body = {product: product};
  },

  async getAll(ctx) {
    let { typeId = null, brandId = null, limit = 100, page = 1 } = ctx.query || {};
    const offset = page * limit - limit;
    let products;

    if(!typeId && !brandId) {
      products = await Product.findAndCountAll({limit, offset, order: [['createdAt', 'DESC']]});
    }

    if(!typeId && brandId) {
      products = await Product.findAndCountAll({where: {brandId}, limit, offset});
    }

    if(typeId && !brandId) {
      products = await Product.findAndCountAll({where: {typeId}, limit, offset});
    }

    if(typeId && brandId) {
      products = await Product.findAndCountAll({where: {brandId, typeId}, limit, offset});
    }

    await sendData(products, ctx);
  },

  async getOne(ctx) {
    const id = ctx.params.id;

    const product = await Product.findOne({
      where: {id},
      include: [{model: ProductInfo, as: 'info'}]
    })
    await sendData(product, ctx);
  },

  async update(ctx) {
    const id = ctx.params.id;

    const currentProduct = await Product.findOne({where: {id}});
    assertItemExists(currentProduct);

    let {name, price, brandId, typeId, info} = ctx.request.body;
    let img = ctx.files.img;
    let newImg;

    if(img) {
      newImg = `img/products/${path.basename(img[0].destination)}/${img[0].filename}`;
      await removeImage(currentProduct.img);
    }

    const product = await Product.update(
      {name, price, brandId, typeId, img: newImg},
      { where: { id }, returning: true }
    );

    await TypeBrand.upsert({typeId, brandId});

    info = JSON.parse(info);

    await ProductInfo.destroy({where: {productId: id}});

    info.forEach(i => {
      ProductInfo.create({
        title: i.title,
        description: i.description,
        productId: id
      })
    });
  
    ctx.status = 201;
    ctx.body = {product: product};
  },

  async delete(ctx) {
    const id = ctx.params.id;

    const currentProduct = await Product.findOne({where: {id}});
    assertItemExists(currentProduct);

    if(currentProduct.img) {
      await removeImage(currentProduct.img);
    }

    await ProductInfo.destroy({where: {productId: id}})

    await Product.destroy({where: { id }});
  
    ctx.status = 200;
    ctx.body = { message: 'Product successfully deleted' };
  },

}

module.exports = productController;