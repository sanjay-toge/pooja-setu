const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/auth');

router.post('/address', auth, addressController.addAddress);
router.get('/address', auth, addressController.getAddresses);
router.put('/address/:id', auth, addressController.updateAddress);
router.delete('/address/:id', auth, addressController.deleteAddress);

module.exports = router;
