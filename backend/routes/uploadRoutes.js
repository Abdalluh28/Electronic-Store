const express = require('express');
const router = express.Router();

const imagesController = require('../controllers/imagesController');



router.route('/').post(imagesController.uploadImage)
router.route('/delete').delete(imagesController.deleteImage)

module.exports = router