const express = require('express');
const router = express.Router();
const controller = require('./controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', verifyToken, controller.getMe);
router.post('/logout', verifyToken, controller.logout);
router.post('/upgrade-premium', verifyToken, controller.upgradePremium);

module.exports = router;
