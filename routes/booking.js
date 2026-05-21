const express = require('express');
const router = express.Router({ mergeParams: true });
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const razorpay = require('../utils/razorpay');


router.post('/', async(req, res) =>{
    try{
        let { id } = req.params;
        console.log('Booking Request received');
        const listing = await Listing.findById(id);

        if(!listing){
            req.flash('error', 'Listing not found');
            res.redirect('/listings');

        }

        const { checkIn, checkOut, guests } = req.body;
        
        const checkInDate = new Date(checkIn);

        const checkOutDate = new Date(checkOut);

        const timeDiff = checkOutDate - checkInDate;

        const nights = Math.ceil(
            timeDiff / (1000 * 60 * 60 * 24)
        );

        if(nights <= 0){

            req.flash("error", "Invalid booking dates!");

            return res.redirect(`/listings/${id}`);
        }

        const totalPrice = nights * listing.price;

        const newBooking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn,
            checkOut,
            guests,
            totalPrice,
        });

        await newBooking.save();
        console.log('Booking Done!');

        res.json({
            success: true,
            bookingId: newBooking._id,
        });

        // req.flash('success', 'Booking created Successful!');
        // res.redirect('/profile');

    } catch(err){

        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');

    }
});


router.post('/:bookingId/create-order', async(req, res) =>{
    try{
        let { bookingId } = req.params;
        
        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({ message: "Booking not Found!" });
        }

        const options = {
            amount: booking.totalPrice * 100,
            currency: "INR",
            receipt: `booking_${bookingId}`,
        };

        const order = await razorpay.orders.create(options);

        booking.orderId = order.id;
        
        await booking.save();

        res.json(order);

    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
})

module.exports = router;