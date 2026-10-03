const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const poiSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    location: {
        latitude: Number,
        longitude: Number
    },

    openingHours: {
        open: String,
        close: String
    },

    visitDuration: {
        type: Number,
        required: true
    },

    entryCost: {
        type: Number,
        default: 0
    },

    indoorOutdoor: {
        type: String,
        enum: ["indoor", "outdoor"]
    },

    popularity: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("POI", poiSchema);