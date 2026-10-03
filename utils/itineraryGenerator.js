const calculatePreferenceScore = require("./preferenceScorer.js");
const getRoute = require("./getRoute.js");


const generateItinerary = async (
    preference,
    pois,
    hotel,
    startTime,
    endTime,
    remainingBudget
) => {

    let itinerary = [];
    let currentTime = startTime;
    let currentBudget = remainingBudget;

    // Start from hotel
    let previousPOI = {
        location: {
            longitude: hotel.geometry.coordinates[0],
            latitude: hotel.geometry.coordinates[1]
        }
    };

    // Highest preference first
    pois.sort((a, b) => {
        return calculatePreferenceScore(preference, b)
             - calculatePreferenceScore(preference, a);
    });


    for (const poi of pois) {

        const score = calculatePreferenceScore(preference, poi);

        let travelTime = 0;

        if (previousPOI) {

            const start = [
                previousPOI.location.longitude,
                previousPOI.location.latitude
            ];

            const end = [
                poi.location.longitude,
                poi.location.latitude
            ];

            const route = await getRoute(start, end);

            travelTime = Number(route.duration);
        }

        const poiStartTime = currentTime;

        const poiEndTime =
            currentTime +
            travelTime +
            poi.visitDuration;


        // console.log(
        //     "POI:",
        //     poi.name,
        //     "Travel:",
        //     travelTime,
        //     "Visit:",
        //     poi.visitDuration,
        //     "Start:",
        //     poiStartTime,
        //     "End:",
        //     poiEndTime
        // );

        if (poiEndTime > endTime) {
            continue;
        }

        if (poi.entryCost > currentBudget) {
            continue;
        }

        itinerary.push({
            poi: poi.name,
            score,
            startTime: poiStartTime,
            endTime: poiEndTime,
            travelTime,
            visitDuration: poi.visitDuration
        });

        currentTime = poiEndTime;
        currentBudget -= poi.entryCost;
        
        previousPOI = poi;
    }

    return itinerary;
};


module.exports = generateItinerary;