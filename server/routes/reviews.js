const express = require('express');
const router = express.Router();
const controller = require('./controllers/reviewController');
const { verifyToken } = require('../middleware/auth');

// Submit a review (requires authentication)
router.post('/', verifyToken, controller.submitReview);

// Get reviews for a product
router.get('/product/:productId', controller.getProductReviews);

// Get user's reviews
router.get('/user/my-reviews', verifyToken, controller.getUserReviews);

// Check if user can review a product
router.get('/check/:productId', verifyToken, controller.canUserReview);

module.exports = router;
