const Trip = require("../models/trip.js");


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
        });

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