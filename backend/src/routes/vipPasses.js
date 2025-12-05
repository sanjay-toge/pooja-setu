const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vipPassController = require('../controllers/vipPassController');

// All routes require authentication
router.use(auth);

// Purchase VIP pass
router.post('/', vipPassController.purchaseVipPass);

// Get user's VIP passes
router.get('/', vipPassController.getMyVipPasses);

// Get specific VIP pass
router.get('/:id', vipPassController.getVipPassById);

// Validate VIP pass (scan QR code)
router.post('/validate', vipPassController.validateVipPass);

module.exports = router;
