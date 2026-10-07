const Trip = require("../models/trip.js");
const Disruption = require("../models/disruption.js");
const Itinerary = require("../models/itinerary.js");
const Preference = require("../models/preference.js");
const POI = require("../models/poi.js");
const Listing = require("../models/listing.js");

const calculatePlanStability = require("../utils/planStability.js");

const generateItinerary = require("../utils/itineraryGenerator.js");


module.exports.createDisruption = async (req, res) => {

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


        const {
            type,
            severity,
            affectedPOI,
            affectedRoute,
            description
        } = req.body;


        const disruption = new Disruption({

            tripId: trip._id,

            type,

            severity,

            affectedPOI,

            affectedRoute,

            description

        });


        await disruption.save();


        res.status(201).json({

            message: "Disruption created successfully",

            disruption

        });


    } catch (err) {

        console.error(
            "Disruption Creation Error:",
            err
        );

        res.status(500).json({

            message: "Unable to create disruption"

        });

    }

};


module.exports.getDisruptions = async (req, res) => {

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


        const disruptions = await Disruption.find({
            tripId: trip._id
        }).populate("affectedPOI");


        res.json({
            disruptions
        });


    } catch (err) {

        console.error(
            "Disruption Fetch Error:",
            err
        );

        res.status(500).json({

            message: "Unable to fetch disruptions"

        });

    }

};


module.exports.checkDisruption = async (req, res) => {

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


        const disruptions = await Disruption.find({
            tripId: trip._id
        });


        let affectedActivities = [];


        for (const disruption of disruptions) {

            if (!disruption.affectedPOI) {
                continue;
            }


            for (const day of itinerary.days) {

                for (const activity of day.activities) {

                    if (
                        activity.poiId.toString() ===
                        disruption.affectedPOI.toString()
                    ) {

                        affectedActivities.push({

                            day: day.date,

                            poiId: activity.poiId,

                            disruptionId: disruption._id,

                            type: disruption.type,

                            severity: disruption.severity

                        });

                    }

                }

            }

        }


        const requiresReplanning =
            affectedActivities.length > 0;


        res.json({

            requiresReplanning,

            affectedActivities,

            message: requiresReplanning
                ? "Disruption affects itinerary. Re-planning required."
                : "No disruption affects the itinerary."

        });


    } catch (err) {

        console.error(
            "Disruption Check Error:",
            err
        );

        res.status(500).json({

            message: "Unable to check disruption"

        });

    }

};


module.exports.replanItinerary = async (req, res) => {

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


        // Get disruptions first
        const disruptions = await Disruption.find({
            tripId: trip._id,
            severity: {
                $in: ["medium", "high"]
            }
        });

        if (disruptions.length === 0) {
            return res.status(400).json({
                message: "No disruption requires re-planning"
            });
        }


        // Convert affected POI IDs to strings
        const affectedPOIIds = disruptions
            .filter(disruption => disruption.affectedPOI)
            .map(disruption =>
                disruption.affectedPOI.toString()
            );

        if (affectedPOIIds.length === 0) {
            return res.status(400).json({
                message: "No affected POI found"
            });
        }


        // Find the itinerary that actually contains
        // the affected POI
        const itineraries = await Itinerary.find({
            tripId: trip._id
        }).sort({
            createdAt: -1
        });

        if (itineraries.length === 0) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }


        let itinerary = null;
        let affectedDayIndex = -1;


        for (const currentItinerary of itineraries) {

            for (let i = 0; i < currentItinerary.days.length; i++) {

                const found = currentItinerary.days[i].activities.some(
                    activity =>
                        affectedPOIIds.includes(
                            activity.poiId.toString()
                        )
                );

                if (found) {
                    itinerary = currentItinerary;
                    affectedDayIndex = i;
                    break;
                }
            }

            if (itinerary) {
                break;
            }
        }


        if (!itinerary || affectedDayIndex === -1) {
            return res.status(400).json({
                message: "Affected POI is not present in any current itinerary"
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


        // Original activities before re-planning
        const originalActivities =
            itinerary.days[affectedDayIndex].activities;


        // Find POIs already used on other days
        const usedPOIIds = [];

        itinerary.days.forEach((day, index) => {

            if (index === affectedDayIndex) {
                return;
            }

            day.activities.forEach(activity => {

                usedPOIIds.push(
                    activity.poiId.toString()
                );

            });

        });


        // Candidate POIs
        // Exclude:
        // 1. affected POI
        // 2. POIs already used on other days
        const candidatePOIs = allPOIs.filter(poi => {

            const id = poi._id.toString();

            return (
                !affectedPOIIds.includes(id) &&
                !usedPOIIds.includes(id)
            );

        });


        // Calculate hotel cost
        const checkIn = new Date(trip.startDate);
        const checkOut = new Date(trip.endDate);

        const nights = Math.ceil(
            (checkOut - checkIn) /
            (1000 * 60 * 60 * 24)
        );

        const hotelCost =
            nights * hotel.price;


        // Remaining trip budget
        const totalRemainingBudget =
            trip.totalBudget - hotelCost;


        // Cost already spent on other days
        let otherDaysCost = 0;

        itinerary.days.forEach((day, index) => {

            if (index !== affectedDayIndex) {
                otherDaysCost += day.dailyCost;
            }

        });


        // Budget available for affected day
        const affectedDayBudget =
            totalRemainingBudget -
            otherDaysCost;


        if (affectedDayBudget < 0) {
            return res.status(400).json({
                message: "Insufficient remaining budget"
            });
        }


        // Generate replacement activities
        const generated = await generateItinerary(
            preference,
            candidatePOIs,
            hotel,
            10 * 60,
            20 * 60,
            affectedDayBudget
        );


        // Convert generated activities
        // into itinerary format
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


        // Calculate plan stability
        const stabilityScore =
            calculatePlanStability(
                originalActivities,
                activities
            );


        // Calculate new daily cost
        const dailyCost = activities.reduce(
            (total, activity) =>
                total + activity.estimatedCost,
            0
        );


        // Replace affected day
        itinerary.days[
            affectedDayIndex
        ].activities = activities;

        itinerary.days[
            affectedDayIndex
        ].dailyCost = dailyCost;


        // Save stability score
        itinerary.stabilityScore =
            stabilityScore;


        // Recalculate total cost
        itinerary.totalCost =
            itinerary.days.reduce(
                (total, day) =>
                    total + day.dailyCost,
                0
            );


        await itinerary.save();


        res.json({

            message:
                "Itinerary re-planned successfully",

            affectedDay:
                affectedDayIndex + 1,

            stabilityScore,

            itinerary

        });


    } catch (err) {

        console.error(
            "Re-planning Error:",
            err
        );

        res.status(500).json({
            message:
                "Unable to re-plan itinerary"
        });

    }

};