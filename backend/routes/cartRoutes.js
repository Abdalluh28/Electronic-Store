const express = require("express");
const router = express.Router();


const cartController = require("../controllers/cartController");


router.route('/').delete(cartController.clearCart);

module.exports = router