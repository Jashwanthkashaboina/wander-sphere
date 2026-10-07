const express = require("express");
const router = express.Router();


const { isLoggedIn } = require("../middleware.js");
const { itineraryGenerator, getItinerary } = require("../controllers/itinerary.js");


router.post("/:tripId/itinerary", isLoggedIn, itineraryGenerator);


router.get("/:tripId/itinerary", isLoggedIn, getItinerary);


module.exports = router;