const express = require('express');
const router = express.Router();
const controller = require('./controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// All order routes require authentication
router.post('/', verifyToken, controller.createOrder);
router.get('/user', verifyToken, controller.getUserOrders);
router.get('/:orderId', verifyToken, controller.getOrder);

module.exports = router;
