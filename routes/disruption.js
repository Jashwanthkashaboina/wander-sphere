const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");
const { createDisruption, 
        getDisruptions, 
        checkDisruption, 
        replanItinerary 
    } = require("../controllers/disruption.js");


// CREATE DISRUPTION
router.post("/:tripId/disruption", isLoggedIn, createDisruption);


// GET DISRUPTIONS
router.get("/:tripId/disruptions", isLoggedIn, getDisruptions);


// CHECK DISRUPTION
router.post("/:tripId/check-disruption", isLoggedIn, checkDisruption);


// RE-PLAN ITINERARY
router.post("/:tripId/replan", isLoggedIn, replanItinerary);


module.exports = router;