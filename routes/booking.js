const express = require('express');
const router = express.Router({ mergeParams: true });
const Booking = require('../models/booking');
const Listing = require('../models/listing');


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

        req.flash('success', 'Booking created Successful!');
        res.redirect('/profile');

    } catch(err){

        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
        
    }
});

module.exports = router;