const express = require('express');
const router = express.Router();
const poojaController = require('../controllers/poojaController');

router.get('/', poojaController.getAllPoojas);
router.get('/:id', poojaController.getPoojaById);
router.get('/temple/:templeId', poojaController.getPoojasByTemple);

module.exports = router;
