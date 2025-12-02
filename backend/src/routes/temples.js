const express = require('express');
const router = express.Router();
const templeController = require('../controllers/templeController');

router.get('/', templeController.getAllTemples);
router.get('/:id', templeController.getTempleById);

module.exports = router;
