const express = require("express");
const router = express.Router();


const { isLoggedIn } = require("../middleware.js");
const { itineraryGenerator, getItinerary, deleteItinerary, regenerateDay } = require("../controllers/itinerary.js");


router.post("/:tripId/itinerary", isLoggedIn, itineraryGenerator);


router.get("/:tripId/itinerary", isLoggedIn, getItinerary);

router.delete("/:tripId/itinerary/:poiId", isLoggedIn, deleteItinerary);

router.post("/:tripId/itinerary/:dayIndex/regenerate", isLoggedIn, regenerateDay);


module.exports = router;