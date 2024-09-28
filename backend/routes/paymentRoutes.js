const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

router.route('/').post(paymentController.processPayment);

// router.route('/').get(paymentController.payPalPayment);


module.exports = router