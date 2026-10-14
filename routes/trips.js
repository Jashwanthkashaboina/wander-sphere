const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");
const 
    { 
        createTrip, 
        getTrip, 
        getHotels, 
        getHotelRecomendation, 
        selectHotel, 
        checkWeatherDisruption 
    } = require("../controllers/trips.js");


// Create a trip
router.post("/", isLoggedIn, createTrip);


// Get a trip
router.get("/:tripId", isLoggedIn, getTrip);

router.get("/:tripId/hotels", isLoggedIn, getHotels);

router.get("/:tripId/recommended-hotels", isLoggedIn, getHotelRecomendation);

router.put("/:tripId/hotel", isLoggedIn, selectHotel);

router.post("/:tripId/check-weather", isLoggedIn, checkWeatherDisruption);

module.exports = router;