const Router = require("@koa/router");
const router = new Router();
const brandController = require('../controllers/brand');
const checkRole = require('../middleware/checkRole');
const auth = require('../middleware/auth');

router.post('/', auth, checkRole('ADMIN'), brandController.create);
router.get('/', brandController.getAll);

module.exports = router;