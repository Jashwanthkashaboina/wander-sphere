require('dotenv').config();
const mongoose = require("mongoose");
const POI = require("../models/poi.js");

mongoose.connect(process.env.ATLASDB_URL)
    .then(async () => {

        console.log("MongoDB connected");

        await POI.deleteMany({});

        const pois = [
            {
                name: "Charminar",
                category: "history",
                location: {
                    latitude: 17.3616,
                    longitude: 78.4747
                },
                visitDuration: 90,
                entryCost: 25,
                indoorOutdoor: "outdoor",
                popularity: 10
            },
            {
                name: "Nehru Zoological Park",
                category: "nature",
                location: {
                    latitude: 17.3507,
                    longitude: 78.4514
                },
                visitDuration: 180,
                entryCost: 100,
                indoorOutdoor: "outdoor",
                popularity: 9
            },
            {
                name: "Salar Jung Museum",
                category: "history",
                location: {
                    latitude: 17.3713,
                    longitude: 78.4804
                },
                visitDuration: 120,
                entryCost: 50,
                indoorOutdoor: "indoor",
                popularity: 8
            },
            {
                name: "Golconda Fort",
                category: "history",
                location: {
                    latitude: 17.3833,
                    longitude: 78.4011
                },
                visitDuration: 150,
                entryCost: 25,
                indoorOutdoor: "outdoor",
                popularity: 10
            }
        ];

        await POI.insertMany(pois);

        console.log("POIs inserted successfully");

        await mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
    });