
const productController = require("../controllers/productControllers");
const { verifyUser, verifyAuthorization } = require("../middlewares/authMiddlerware");

const router = require("express").Router()

router.post('/', verifyUser, verifyAuthorization, productController.addProduct)

router.get('/', productController.getProducts)

router.get('/:sku', productController.getProduct)

router.put('/:id', verifyUser, verifyAuthorization, productController.updateProduct)

router.delete('/:id', verifyUser, verifyAuthorization, productController.deleteProduct)
 
module.exports = router