const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");

const productController = require("../controllers/productController");
const { verifyAdmin, verifyJWT } = require('../middleware/authMiddleware');
const checkId = require('../middleware/checkId');


router.route('/').get(productController.getProducts).post(verifyJWT, verifyAdmin, formidable(), productController.addProduct);
router.route('/allProducts').get(productController.getAllProducts);
router.route('/top').get(productController.getTopProducts);
router.route('/new').get(productController.getNewProducts);
router.route('/productByCategory').get(productController.getProductsByCategory);
router.route('/:id').get(productController.getProduct).put(verifyJWT, verifyAdmin, formidable(), productController.updateProduct).delete(verifyJWT, verifyAdmin, productController.deleteProduct);
router.route('/:id/reviews').post(verifyJWT, checkId, productController.createProductReview);
router.route('/:id/deleteReview').delete(verifyJWT, checkId, productController.deleteProductReview);
router.route('/:id/related').get(productController.getRelatedProducts);


module.exports = router