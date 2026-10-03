function calculatePreferenceScore(preference, poi) {

    let score = 0;

    // Interest matches POI category
    if (preference.interests.includes(poi.category)) {
        score += 5;
    }

    // Preferred activity matches POI category
    if (preference.preferredActivities.includes(poi.category)) {
        score += 3;
    }

    // Must-visit place
    if (preference.mustVisitPlaces.includes(poi.name)) {
        score += 10;
    }

    return score;
}

module.exports = calculatePreferenceScore;