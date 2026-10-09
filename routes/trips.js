const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");
const { createTrip, getTrip, getHotels } = require("../controllers/trips.js");

// Create a trip
router.post("/", isLoggedIn, createTrip);


// Get a trip
router.get("/:tripId", isLoggedIn, getTrip);

router.get("/:tripId/hotels", isLoggedIn, getHotels);


module.exports = router;