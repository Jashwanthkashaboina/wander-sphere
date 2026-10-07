const express = require('express');
const router = express.Router({ mergeParams: true });
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');
const sendBookingEmail = require('../utils/sendEmail');
const generateInvoice = require('../utils/generateInvoice');
const { createBooking, createOrder, verifyPayment, deleteBooking } = require('../controllers/bookings');
const { isLoggedIn } = require('../middleware');
router.post('/', isLoggedIn, createBooking);


router.post('/:bookingId/create-order', isLoggedIn, createOrder);


router.post('/verify-payment', isLoggedIn, verifyPayment);

router.delete('/:bookingId', isLoggedIn, deleteBooking);

module.exports = router;