const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController')

const { verifyAdmin, verifyJWT } = require('../middleware/authMiddleware')

router.route('/').post(verifyJWT, verifyAdmin, categoryController.addCategory)
router.route('/:categoryId').delete(verifyJWT, verifyAdmin, categoryController.deleteCategory).put(verifyJWT, verifyAdmin, categoryController.updateCategory)
router.route('/categories').get(categoryController.getCategories)
router.route('/:productId').get(categoryController.readCategory)

module.exports = router