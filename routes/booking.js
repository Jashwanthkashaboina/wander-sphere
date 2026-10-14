const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBooking, createOrder, verifyPayment, deleteBooking } = require('../controllers/bookings');
const { isLoggedIn } = require('../middleware');


router.post('/', isLoggedIn, createBooking);


router.post('/:bookingId/create-order', isLoggedIn, createOrder);


router.post('/verify-payment', isLoggedIn, verifyPayment);

router.delete('/:bookingId', isLoggedIn, deleteBooking);

module.exports = router;