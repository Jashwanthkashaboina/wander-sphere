const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itinerarySchema = new Schema({

    tripId: {
        type: Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    days: [
        {
            date: Date,

            activities: [
                {
                    poiId: {
                        type: Schema.Types.ObjectId,
                        ref: "POI",
                        required: true
                    },

                    startTime: Number,

                    endTime: Number,

                    travelTime: Number,

                    estimatedCost: {
                        type: Number,
                        default: 0
                    }
                }
            ],

            dailyCost: {
                type: Number,
                default: 0
            }
        }
    ],

    totalCost: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("Itinerary", itinerarySchema);