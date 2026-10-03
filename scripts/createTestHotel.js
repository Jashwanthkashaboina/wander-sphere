require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

mongoose.connect(process.env.ATLASDB_URL)
    .then(async () => {

        console.log("MongoDB connected");

        const testHotel = new Listing({
            title: "Test Hyderabad Hotel",

            description: "Temporary hotel for WanderSphere itinerary testing.",

            price: 3000,

            location: "Hyderabad",

            country: "India",

            image: {
                url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                filename: "test-hyderabad-hotel"
            },

            geometry: {
                type: "Point",
                coordinates: [78.4740, 17.3600]
            }
        });

        await testHotel.save();

        console.log("Test hotel created successfully!");
        console.log("Hotel ID:", testHotel._id);
        console.log("Coordinates:", testHotel.geometry.coordinates);

        await mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error:", err);
    });