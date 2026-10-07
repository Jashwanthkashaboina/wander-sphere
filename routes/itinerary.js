const express = require("express");
const router = express.Router();

const Trip = require("../models/trip.js");
const Preference = require("../models/preference.js");
const POI = require("../models/poi.js");
const Itinerary = require("../models/itinerary.js");
const Listing = require("../models/listing.js");

const generateItinerary = require("../utils/itineraryGenerator.js");
const { isLoggedIn } = require("../middleware.js");


router.post("/:tripId/itinerary", isLoggedIn, async (req, res) => {

    try {

        const trip = await Trip.findOne({
            _id: req.params.tripId,
            userId: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }


        const hotel = await Listing.findById(trip.hotelId);
        console.log("HOTEL:", hotel.title);
        console.log("HOTEL COORDINATES:", hotel.geometry.coordinates);
        
        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }


        const checkIn = new Date(trip.startDate);
        const checkOut = new Date(trip.endDate);

        const nights = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        const totalDays = nights;


        const hotelCost = nights * hotel.price;

        const remainingBudget = trip.totalBudget - hotelCost;

        if (remainingBudget < 0) {
            return res.status(400).json({
                message: "Hotel cost exceeds the total trip budget"
            });
        }


        const preference = await Preference.findOne({
            userId: req.user._id
        });

        if (!preference) {
            return res.status(404).json({
                message: "Preferences not found"
            });
        }


        const allPOIs = await POI.find();
        let remainingPOIs = [...allPOIs];

        let dailyRemainingBudget = remainingBudget;

        // 10 AM → 8 PM
        const startTime = 10 * 60;
        const endTime = 20 * 60;


        let allDays = [];


        for (let day = 0; day < totalDays; day++) {

            console.log(`Generating Day ${day + 1}`);


            const generated = await generateItinerary(
                preference,
                remainingPOIs,
                hotel,
                startTime,
                endTime,
                dailyRemainingBudget
            );


            // Save the generated activities for this day
            allDays.push(generated);


            // Calculate cost of current day
            const dayCost = generated.reduce((total, item) => {

                const poi = remainingPOIs.find(
                    p => p.name === item.poi
                );

                return total + poi.entryCost;

            }, 0);


            // Update remaining budget
            dailyRemainingBudget -= dayCost;


            // Find POIs visited today
            const visitedPOIIds = generated.map(item => {

                const poi = remainingPOIs.find(
                    p => p.name === item.poi
                );

                return poi._id.toString();

            });


            // Remove visited POIs
            remainingPOIs = remainingPOIs.filter(
                poi => !visitedPOIIds.includes(
                    poi._id.toString()
                )
            );

        }


        /*
         * Convert generated days into
         * MongoDB itinerary structure
         */

        const days = allDays.map((generated, index) => {

            const activities = generated.map(item => {

                const poi = allPOIs.find(
                    p => p.name === item.poi
                );

                return {
                    poiId: poi._id,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    travelTime: item.travelTime,
                    estimatedCost: poi.entryCost
                };
            });


            const date = new Date(trip.startDate);

            date.setDate(
                date.getDate() + index
            );


            return {
                date,
                activities,
                dailyCost: activities.reduce(
                    (total, activity) =>
                        total + activity.estimatedCost,
                    0
                )
            };

        });


        const totalCost = days.reduce(
            (total, day) =>
                total + day.dailyCost,
            0
        );


        const itinerary = new Itinerary({

            tripId: trip._id,

            days,

            totalCost

        });


        await itinerary.save();


        res.status(201).json({

            message: "Itinerary generated successfully",

            itinerary

        });


    } catch (err) {

        console.error(
            "Itinerary Generation Error:",
            err
        );

        res.status(500).json({

            message: "Unable to generate itinerary"

        });

    }

});



router.get("/:tripId/itinerary", isLoggedIn, async (req, res) => {

    try {

        const trip = await Trip.findOne({
            _id: req.params.tripId,
            userId: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const itinerary = await Itinerary.findOne({
            tripId: trip._id
        }).populate("days.activities.poiId");

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        res.json({
            itinerary
        });

    } catch (err) {

        console.error(
            "Fetch Itinerary Error:",
            err
        );

        res.status(500).json({
            message: "Unable to fetch itinerary"
        });

    }

});


module.exports = router;