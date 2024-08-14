const Router = require("@koa/router");
const router = new Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', auth);
router.post('/logout', userController.logOut);

module.exports = router;
