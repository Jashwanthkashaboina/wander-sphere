const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disruptionSchema = new Schema({
    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    type: {
        type: String,
        enum: ["weather", "traffic"],
        required: true
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },

    affectedPOI: {
        type: Schema.Types.ObjectId,
        ref: "POI"
    },

    affectedRoute: {
        from: String,
        to: String
    },

    description: {
        type: String,
        required: true
    },

    detectedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("Disruption", disruptionSchema);