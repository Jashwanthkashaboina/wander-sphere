const Preference = require("../models/preference.js");


// Create preferences
module.exports.createPreference = async (req, res) => {
    try {

        const preference = await Preference.findOneAndUpdate(
            { userId: req.user._id },
            {
                userId: req.user._id,
                interests: req.body.interests,
                budgetLevel: req.body.budgetLevel,
                travelPace: req.body.travelPace,
                preferredActivities: req.body.preferredActivities,
                mustVisitPlaces: req.body.mustVisitPlaces
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).json({
            message: "Preferences saved successfully",
            preference
        });

    } catch (err) {

        console.error("Preference Error:", err);

        res.status(500).json({
            message: "Unable to save preferences"
        });
    }
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