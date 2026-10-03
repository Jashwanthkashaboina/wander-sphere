const Preference = require("../models/preference.js");


// Create preferences
module.exports.createPreference = async (req, res) => {
    const existingPreference = await Preference.findOne({
        userId: req.user._id
    });

    if (existingPreference) {
        return res.status(400).json({
            message: "Preferences already exist"
        });
    }

    const preference = new Preference({
        userId: req.user._id,
        interests: req.body.interests,
        budgetLevel: req.body.budgetLevel,
        travelPace: req.body.travelPace,
        preferredActivities: req.body.preferredActivities,
        mustVisitPlaces: req.body.mustVisitPlaces
    });

    await preference.save();

    res.status(201).json({
        message: "Preferences saved successfully",
        preference
    });
};


// Get preferences
module.exports.getPreference = async (req, res) => {
    const preference = await Preference.findOne({
        userId: req.user._id
    });

    if (!preference) {
        return res.status(404).json({
            message: "Preferences not found"
        });
    }

    res.json(preference);
};


// Update preferences
module.exports.updatePreference = async (req, res) => {
    const preference = await Preference.findOneAndUpdate(
        { userId: req.user._id },
        {
            interests: req.body.interests,
            budgetLevel: req.body.budgetLevel,
            travelPace: req.body.travelPace,
            preferredActivities: req.body.preferredActivities,
            mustVisitPlaces: req.body.mustVisitPlaces
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!preference) {
        return res.status(404).json({
            message: "Preferences not found"
        });
    }

    res.json({
        message: "Preferences updated successfully",
        preference
    });
};