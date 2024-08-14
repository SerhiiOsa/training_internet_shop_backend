const Router = require("@koa/router");
const router = new Router();
const typeController = require('../controllers/type');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/', auth, checkRole('ADMIN'), typeController.create);
router.get('/', typeController.getAll);

module.exports = router;