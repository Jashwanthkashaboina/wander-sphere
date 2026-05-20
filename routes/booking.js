const express = require('express');
const router = express.Router({ mergeParams: true });
const BookingModel = require('../models/booking');
const Listing = require('../models/listing');


// router.post('/', async(req, res) =>{
//     try{
//         let { id } = req.params;
//         const listing = await listing.findById(id);

//         if(!listing){
//             req.flash('error', 'Listing not found');
//             res.redirect('/listings');

//         }

//         const { checkIn, checkOut, guests } = req.body;


//     }
// })