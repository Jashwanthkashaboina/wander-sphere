const calculatePreferenceScore = require("../utils/preferenceScorer.js");

const preference = {
    interests: ["nature", "history"],
    preferredActivities: ["sightseeing"],
    mustVisitPlaces: ["Charminar"]
};

const pois = [
    {
        name: "Charminar",
        category: "history"
    },
    {
        name: "Nehru Zoological Park",
        category: "nature"
    },
    {
        name: "Salar Jung Museum",
        category: "history"
    }
];

pois.forEach(poi => {

    const score = calculatePreferenceScore(preference, poi);

    console.log(`${poi.name} → ${score}`);

});