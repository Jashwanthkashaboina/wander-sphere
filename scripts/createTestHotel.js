require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

mongoose.connect(process.env.ATLASDB_URL)
    .then(async () => {

        console.log("MongoDB connected");

        const hotel = new Listing({

            title: "Test Hyderabad Hotel",

            description: "Temporary hotel for WanderSphere itinerary testing",

            price: 3000,

            location: "Hyderabad",

            country: "India",

            geometry: {
                type: "Point",
                coordinates: [78.4740, 17.3600]
            },

            image: {
                url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
                filename: "test-hotel"
            },

            owner: new mongoose.Types.ObjectId("69037323e45de26b36b2e1fd")

        });

        await hotel.save();

        console.log("Test Hyderabad Hotel created:");
        console.log(hotel);

        await mongoose.connection.close();

    })
    .catch(err => {
        console.error("Error:", err);
    });