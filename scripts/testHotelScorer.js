require("dotenv").config();

const mongoose = require("mongoose");

const Trip = require("../models/trip.js");
const Itinerary = require("../models/itinerary.js");
const Listing = require("../models/listing.js");
const POI = require("../models/poi.js");

const calculateHotelScore = require("../utils/hotelScorer.js");


async function test() {

    try {

        await mongoose.connect(
            process.env.ATLASDB_URL
        );

        console.log("MongoDB connected");


        // Get one trip

        const trip = await Trip.findOne();

        if (!trip) {
            console.log("No trip found");
            return;
        }


        // Get its itinerary

        const itinerary =
            await Itinerary
                .findOne({
                    tripId: trip._id
                })
                .populate("days.activities.poiId");


        if (!itinerary) {
            console.log("No itinerary found");
            return;
        }


        // Get all hotels

        const hotels =
            await Listing.find({
                location: {
                    $regex: trip.destination,
                    $options: "i"
                }
            });


        console.log("\nHotel Scores:\n");


        for (const hotel of hotels) {

            const result =
                await calculateHotelScore(
                    hotel,
                    trip,
                    itinerary
                );


            console.log(`${hotel.title}`);

            console.log(`Price: ₹${hotel.price}/night`);

            if (result === -1) {
                console.log("Unaffordable");
            } else {
                console.log(`Score: ${result.score}`);
                console.log(`Average Travel Time: ${result.averageTravelTime} minutes`);
            }

            console.log("-------------------------");

        }


    } catch (err) {

        console.error(
            "Hotel Scoring Error:",
            err
        );

    } finally {

        await mongoose.connection.close();

    }

}


test();