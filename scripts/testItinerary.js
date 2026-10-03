require("dotenv").config();

const mongoose = require("mongoose");

const Preference = require("../models/preference.js");
const POI = require("../models/poi.js");

const generateItinerary = require("../utils/itineraryGenerator.js");


mongoose.connect(process.env.ATLASDB_URL)
    .then(async () => {

        console.log("MongoDB connected");

        // Get the preference we already created
        const preference = await Preference.findOne();

        // Get all POIs
        const pois = await POI.find();

        // 10:00 AM → 8:00 PM
        const startTime = 10 * 60;
        const endTime = 20 * 60;

        const itinerary = await generateItinerary(
            preference,
            pois,
            startTime,
            endTime
        );

        console.log("\nGenerated Itinerary:\n");

        console.log(itinerary);

        await mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
    });