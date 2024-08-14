const Router = require("@koa/router");
const router = new Router();
const productController = require('../controllers/product');
const multer = require("@koa/multer");
const fs = require("fs");
const path = require("path");
const { generateFilePath } = require('./utils');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "public/img/products";
    const filePath = generateFilePath(uploadPath, file.originalname);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    cb(null, path.dirname(filePath));
  },

  filename: function (req, file, cb) {
    const uniqueIdentifier = Date.now();
    const fileName = `${uniqueIdentifier}_${file.originalname}`;
    const sanitizedFileName = fileName.replace(/\s/g, "_");
    cb(null, sanitizedFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: "5mb",
});

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', auth, checkRole('ADMIN'), upload.fields([{ name: "img" }]), productController.create);
router.put('/:id', auth, checkRole('ADMIN'), upload.fields([{ name: "img" }]), productController.update);
router.delete('/:id', auth, checkRole('ADMIN'), productController.delete);


module.exports = router;
