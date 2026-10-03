const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tripSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    destination: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    travellers: {
        type: Number,
        required: true
    },

    totalBudget: {
        type: Number,
        required: true
    },

    hotelId: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    },

    status: {
        type: String,
        enum: ["planned", "active", "completed"],
        default: "planned"
    }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);