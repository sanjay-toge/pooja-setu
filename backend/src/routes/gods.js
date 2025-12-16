const express = require('express');
const router = express.Router();
const godController = require('../controllers/godController');

router.get('/', godController.getGods);
router.get('/:id', godController.getGodById);

module.exports = router;
