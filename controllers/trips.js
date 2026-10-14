const Trip = require("../models/trip.js");
const Listing = require("../models/listing.js");
const calculateHotelScore = require("../utils/hotelScorer.js");
const Itinerary = require("../models/itinerary.js");

module.exports.createTrip = async (req, res) => {

    try {

        const {
            destination,
            startDate,
            endDate,
            travellers,
            totalBudget,
            hotelId
        } = req.body;

        const trip = new Trip({
            userId: req.user._id,
            destination,
            startDate,
            endDate,
            travellers,
            totalBudget,
            hotelId
        });

        await trip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });

    } catch (err) {

        console.error("Trip Creation Error:", err);

        res.status(500).json({
            message: "Unable to create trip"
        });
    }
};


module.exports.getTrip = async (req, res) => {

    try {

        const trip = await Trip.findOne({
            _id: req.params.tripId,
            userId: req.user._id
        }).populate("hotelId");

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.json(trip);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Unable to fetch trip"
        });
    }
};

module.exports.getHotels = async (req, res) => {

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

        const hotels = await Listing.find({
            location: {
                $regex: trip.destination,
                $options: "i"
            }
        });

        res.json({
            hotels
        });

    } catch (err) {

        console.error(
            "Hotel Fetch Error:",
            err
        );

        res.status(500).json({
            message: "Unable to fetch hotels"
        });

    }

};


module.exports.getHotelRecomendation = async (req, res) => {

    try {
        // console.log('Reached Hotel Recomendation Route');

        // Get trip
        const trip = await Trip.findOne({
            _id: req.params.tripId,
            userId: req.user._id
        });

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }


        // Get itinerary
        const itinerary = await Itinerary
            .findOne({
                tripId: trip._id
            })
            .populate("days.activities.poiId");

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }


        // Get hotels in destination
        const hotels = await Listing.find({
            location: {
                $regex: trip.destination,
                $options: "i"
            }
        });


        // console.log("Destination:", trip.destination);
        // console.log("Hotels found:", hotels.length);


        // Calculate score for every hotel
        const recommendations = [];

        for (const hotel of hotels) {

            const result =
                await calculateHotelScore(
                    hotel,
                    trip,
                    itinerary
                );

            // console.log(hotel.title, "=>", result);

            if (result === -1) {
                continue;
            }

            recommendations.push({
                hotel,
                score: result.score,
                averageTravelTime:
                    result.averageTravelTime
            });

        }


        // Highest score first
        recommendations.sort(
            (a, b) => b.score - a.score
        );
        

        res.json({
            recommendations
        });

    } catch (err) {

        console.error(
            "Hotel Recommendation Error:",
            err
        );

        res.status(500).json({
            message: "Unable to generate hotel recommendations"
        });

    }
};



// Select hotel for trip
module.exports.selectHotel = async (req, res) => {

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

        const hotel = await Listing.findById(req.body.hotelId);

        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found"
            });
        }

        trip.hotelId = hotel._id;

        await trip.save();

        res.json({
            message: "Hotel selected successfully",
            hotelId: hotel._id
        });

    } catch (err) {

        console.error("Select Hotel Error:", err);

        res.status(500).json({
            message: "Unable to select hotel"
        });

    }
};



module.exports.checkWeatherDisruption = async (req, res) => {

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

        const itinerary = await Itinerary.findOne({tripId: trip._id}).populate("days.activities.poiId");

        if (!itinerary) {
            return res.status(404).json({
                message: "Itinerary not found"
            });
        }

        console.log("Itinerary found:");
        console.log(itinerary);

    } catch (err) {

        console.error("Weather Disruption Error:", err);

        res.status(500).json({
            message: "Unable to check weather disruption"
        });
    }
};