const express = require('express');
const router = express.Router();
const controller = require('./controllers/productController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', controller.listProducts);
router.get('/:id', controller.getProductById);

// Admin routes (require both authentication and admin role)
router.get('/admin/all', verifyToken, requireAdmin, controller.getAllProductsAdmin);
router.post('/admin/create', verifyToken, requireAdmin, controller.createProduct);
router.put('/admin/:id', verifyToken, requireAdmin, controller.updateProduct);
router.delete('/admin/:id', verifyToken, requireAdmin, controller.deleteProduct);

module.exports = router;