const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { verifyAdmin, verifyJWT } = require('../middleware/authMiddleware');


router.route('/').post(verifyJWT, orderController.createOrder).get(verifyJWT, verifyAdmin, orderController.getAllOrders);
router.route('/myorders/:id').get(verifyJWT, orderController.getMyOrders);
router.route('/:id').get(verifyJWT, orderController.getSingleOrder);
router.route('/:id/pay').put(verifyJWT, orderController.updateOrderToPaid);
router.route('/:id/deliver').put(verifyJWT, orderController.updateOrderToDelivered);
router.route('/totalOrders').get(orderController.getTotalOrders);
router.route('/totalSales').get(orderController.getTotalSales);
router.route('/totalSalesByDate').get(orderController.getTotalSalesByDate);



module.exports = router