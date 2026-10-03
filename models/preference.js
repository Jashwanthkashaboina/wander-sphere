const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    interests: [{
        type: String
    }],

    budgetLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },

    travelPace: {
        type: String,
        enum: ["relaxed", "moderate", "packed"],
        required: true
    },

    preferredActivities: [{
        type: String
    }],

    mustVisitPlaces: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model("Preference", preferenceSchema);