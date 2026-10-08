const Trip = require("../models/trip.js");
const Preference = require("../models/preference.js");
const POI = require("../models/poi.js");
const Itinerary = require("../models/itinerary.js");
const Listing = require("../models/listing.js");

const generateItinerary = require("../utils/itineraryGenerator.js");


// Generate Itinerary
const itineraryGenerator = async (req, res) => {

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

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        const checkIn = new Date(trip.startDate);
        const checkOut = new Date(trip.endDate);

        const nights = Math.ceil(
            (checkOut - checkIn) /
            (1000 * 60 * 60 * 24)
        );

        const totalDays = nights;

        const hotelCost = nights * hotel.price;

        const remainingBudget =
            trip.totalBudget - hotelCost;

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

            allDays.push(generated);

            const dayCost = generated.reduce(
                (total, item) => {

                    const poi = remainingPOIs.find(
                        p => p.name === item.poi
                    );

                    return total + poi.entryCost;

                },
                0
            );

            dailyRemainingBudget -= dayCost;

            const visitedPOIIds = generated.map(item => {

                const poi = remainingPOIs.find(
                    p => p.name === item.poi
                );

                return poi._id.toString();

            });

            remainingPOIs = remainingPOIs.filter(
                poi => !visitedPOIIds.includes(
                    poi._id.toString()
                )
            );

        }

        const days = allDays.map(
            (generated, index) => {

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

                const date = new Date(
                    trip.startDate
                );

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

            }
        );

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
};


// Get Itinerary
const getItinerary = async (req, res) => {

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
};


// Delete Activity
const deleteItinerary = async (req, res) => {

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
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        const poiId = req.params.poiId;

        let activityFound = false;

        itinerary.days.forEach(day => {

            const originalLength =
                day.activities.length;

            day.activities =
                day.activities.filter(
                    activity =>
                        activity.poiId.toString() !== poiId
                );

            if (
                day.activities.length !==
                originalLength
            ) {
                activityFound = true;
            }

            day.dailyCost =
                day.activities.reduce(
                    (total, activity) =>
                        total + activity.estimatedCost,
                    0
                );

        });

        if (!activityFound) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        itinerary.totalCost =
            itinerary.days.reduce(
                (total, day) =>
                    total + day.dailyCost,
                0
            );

        await itinerary.save();

        res.json({
            message: "Activity removed successfully",
            itinerary
        });

    } catch (err) {

        console.error(
            "Delete Activity Error:",
            err
        );

        res.status(500).json({
            message: "Unable to remove activity"
        });

    }
};


// Regenerate Day
const regenerateDay = async (req, res) => {

    try {

        const { tripId, dayIndex } = req.params;

        const index = Number(dayIndex);

        const trip = await Trip.findOne({
            _id: tripId,
            userId: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const itinerary = await Itinerary.findOne({
            tripId: trip._id
        });

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        if (!itinerary.days[index]) {
            return res.status(404).json({
                message: "Day not found"
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

        const hotel = await Listing.findById(
            trip.hotelId
        );

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        const allPOIs = await POI.find();


        /*
         * IMPORTANT:
         * Collect POIs already used anywhere
         * in the itinerary.
         */

        const usedPOIIds = [];

        itinerary.days.forEach(day => {

            day.activities.forEach(activity => {

                usedPOIIds.push(
                    activity.poiId.toString()
                );

            });

        });


        /*
         * Remove all already-used POIs.
         * This forces regeneration to choose
         * a different POI.
         */

        const availablePOIs = allPOIs.filter(
            poi =>
                !usedPOIIds.includes(
                    poi._id.toString()
                )
        );


        /*
         * Calculate total activity budget.
         */

        const nights = Math.ceil(
            (
                new Date(trip.endDate) -
                new Date(trip.startDate)
            ) /
            (1000 * 60 * 60 * 24)
        );

        const hotelCost =
            nights * hotel.price;

        const activityBudget =
            trip.totalBudget - hotelCost;


        /*
         * Cost used by other days.
         */

        const otherDaysCost =
            itinerary.days.reduce(
                (total, day, currentIndex) => {

                    if (currentIndex === index) {
                        return total;
                    }

                    return total + day.dailyCost;

                },
                0
            );


        const dayBudget =
            activityBudget - otherDaysCost;


        if (dayBudget < 0) {
            return res.status(400).json({
                message: "Insufficient remaining budget"
            });
        }


        /*
         * Generate a fresh plan.
         */

        const generated =
            await generateItinerary(
                preference,
                availablePOIs,
                hotel,
                10 * 60,
                20 * 60,
                dayBudget
            );


        const activities =
            generated.map(item => {

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


        const dailyCost =
            activities.reduce(
                (total, activity) =>
                    total + activity.estimatedCost,
                0
            );


        /*
         * Replace selected day.
         */

        itinerary.days[index].activities =
            activities;

        itinerary.days[index].dailyCost =
            dailyCost;


        /*
         * Recalculate total cost.
         */

        itinerary.totalCost =
            itinerary.days.reduce(
                (total, day) =>
                    total + day.dailyCost,
                0
            );


        await itinerary.save();


        res.json({
            message: "Day regenerated successfully",
            itinerary
        });

    } catch (err) {

        console.error(
            "Regenerate Day Error:",
            err
        );

        res.status(500).json({
            message: "Unable to regenerate day"
        });

    }
};


module.exports = {
    itineraryGenerator,
    getItinerary,
    deleteItinerary,
    regenerateDay
};