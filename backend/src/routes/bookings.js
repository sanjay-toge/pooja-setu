const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getMyBookings);
router.get('/:id', auth, bookingController.getBookingById);

module.exports = router;
