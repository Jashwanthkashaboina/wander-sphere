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


    // for (const poi of pois) {

    //     const score = calculatePreferenceScore(
    //         preference,
    //         poi
    //     );
         
    //     // Travel from previous location to POI
    //     const start = [
    //         previousPOI.location.longitude,
    //         previousPOI.location.latitude
    //     ];

    //     const end = [
    //         poi.location.longitude,
    //         poi.location.latitude
    //     ];


    //     const route = await getRoute(
    //         start,
    //         end
    //     );


    //     const travelTime = Number(route.duration);

         
    //     // Calculate POI timing
    //     const poiStartTime = currentTime;

    //     const poiEndTime = currentTime + travelTime + poi.visitDuration;

         
    //     // Check POI time
    //     if (poiEndTime > endTime) {
    //         continue;
    //     }


         
    //     // Check POI budget

    //     if (poi.entryCost > currentBudget) {
    //         continue;
    //     }

        
    //     // Check return journey to hotel
    //     const hotelStart = [
    //         poi.location.longitude,
    //         poi.location.latitude
    //     ];

    //     const hotelEnd = [
    //         hotel.geometry.coordinates[0],
    //         hotel.geometry.coordinates[1]
    //     ];


    //     const returnRoute = await getRoute(
    //         hotelStart,
    //         hotelEnd
    //     );


    //     const returnTravelTime =
    //         Number(returnRoute.duration);


    //     const hotelArrivalTime =
    //         poiEndTime + returnTravelTime;


    //     // If we cannot return to hotel before 8 PM,
    //     // do not add this POI.
    //     if (hotelArrivalTime > endTime) {
    //         continue;
    //     }

    //     // Add POI
    //     itinerary.push({

    //         poi: poi.name,

    //         score,

    //         startTime: poiStartTime,

    //         endTime: poiEndTime,

    //         travelTime,

    //         visitDuration: poi.visitDuration

    //     });

    //     // Update state
    //     currentTime = poiEndTime;

    //     currentBudget -= poi.entryCost;

    //     previousPOI = poi;

    // }

    for (const poi of pois) {

        const score = calculatePreferenceScore(preference, poi);

        const start = [
            previousPOI.location.longitude,
            previousPOI.location.latitude
        ];

        const end = [
            poi.location.longitude,
            poi.location.latitude
        ];

        const route = await getRoute(start, end);
        const travelTime = Number(route.duration);

        const poiStartTime = currentTime;

        const poiEndTime =
            currentTime + travelTime + poi.visitDuration;


        console.log("Checking POI:", poi.name);
        console.log("Travel:", travelTime);
        console.log("Visit:", poi.visitDuration);
        console.log("Start:", poiStartTime);
        console.log("End:", poiEndTime);
        console.log("Budget:", currentBudget);
        console.log("Cost:", poi.entryCost);


        if (poiEndTime > endTime) {
            console.log("❌ SKIPPED: Time exceeded");
            continue;
        }

        if (poi.entryCost > currentBudget) {
            console.log("❌ SKIPPED: Budget exceeded");
            continue;
        }


        // Check return journey to hotel

        const hotelStart = [
            poi.location.longitude,
            poi.location.latitude
        ];

        const hotelEnd = [
            hotel.geometry.coordinates[0],
            hotel.geometry.coordinates[1]
        ];

        const returnRoute =
            await getRoute(hotelStart, hotelEnd);

        const returnTravelTime =
            Number(returnRoute.duration);

        const hotelArrivalTime =
            poiEndTime + returnTravelTime;


        console.log("Return travel:", returnTravelTime);
        console.log("Hotel arrival:", hotelArrivalTime);


        if (hotelArrivalTime > endTime) {
            console.log("❌ SKIPPED: Cannot return to hotel");
            continue;
        }


        console.log("✅ ACCEPTED:", poi.name);


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