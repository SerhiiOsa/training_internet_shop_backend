const Router = require("@koa/router");
const router = new Router();
const ratingController = require('../controllers/rating')
const auth = require('../middleware/auth');

router.post('/', auth, ratingController.create);

module.exports = router;