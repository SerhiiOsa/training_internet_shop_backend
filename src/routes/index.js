const Router = require("@koa/router");
const router = new Router();

const userRouter = require('./user'),
      productRouter = require('./product'),
      typeRouter = require('./type'),
      brandRouter = require('./brand'),
      characteristicRouter = require('./characteristic'),
      raitingRouter = require('./rating'),
      basketRouter = require('./basket');

router.prefix('/api')

router.use('/user', userRouter.routes());
router.use('/product', productRouter.routes());
router.use('/type', typeRouter.routes());
router.use('/brand', brandRouter.routes());
router.use('/characteristic', characteristicRouter.routes());
router.use('/rating', raitingRouter.routes());
router.use('/basket', basketRouter.routes());

module.exports = router;