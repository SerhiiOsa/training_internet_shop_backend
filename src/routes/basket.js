const Router = require("@koa/router");
const router = new Router();
const basketController = require('../controllers/basket')
const auth = require('../middleware/auth');

router.use(auth);
router.post('/addProduct', basketController.addToBasket);
router.post('/editQuantity', basketController.editProductQuantity);
router.get('/', basketController.getUserBasket);
router.post('/deleteProduct', basketController.removeFromBasket);

module.exports = router;