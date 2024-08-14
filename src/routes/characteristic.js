const Router = require("@koa/router");
const router = new Router();
const characteristicController = require('../controllers/characteristic');
const checkRole = require('../middleware/checkRole');
const auth = require('../middleware/auth');

router.get('/', auth, checkRole('ADMIN'), characteristicController.getAll);

module.exports = router;
