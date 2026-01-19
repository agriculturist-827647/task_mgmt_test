const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validate');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.post('/logout', auth, authController.logout);
router.get('/verify', auth, authController.verify);
router.get('/profile', auth, authController.getProfile);

module.exports = router;
