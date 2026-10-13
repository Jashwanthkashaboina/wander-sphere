const getRoute = require("./getRoute.js");


const calculateHotelScore = async (
    hotel,
    trip,
    itinerary
) => {

    let score = 0;


    // =========================
    // 1. Budget Suitability
    // =========================

    const nights = Math.ceil(
        (
            new Date(trip.endDate) -
            new Date(trip.startDate)
        ) /
        (1000 * 60 * 60 * 24)
    );

    const hotelCost =
        hotel.price * nights;

    const remainingBudget =
        trip.totalBudget - hotelCost;


    if (remainingBudget < 0) {
        return -1;
    }


    const budgetScore =
        (remainingBudget / trip.totalBudget) * 40;

    score += budgetScore;


    // =========================
    // 2. Location Suitability
    // =========================

    let totalTravelTime = 0;
    let poiCount = 0;


    for (const day of itinerary.days) {

        for (const activity of day.activities) {

            const poi = activity.poiId;

            const hotelCoordinates = [
                hotel.geometry.coordinates[0],
                hotel.geometry.coordinates[1]
            ];

            const poiCoordinates = [
                poi.location.longitude,
                poi.location.latitude
            ];


            const route = await getRoute(
                hotelCoordinates,
                poiCoordinates
            );


            totalTravelTime += Number(route.duration);

            poiCount++;

        }

    }


    let locationScore = 0;


    if (poiCount > 0) {

        const averageTravelTime =
            totalTravelTime / poiCount;

        /*
         * Lower travel time = better hotel.
         *
         * Maximum location score = 40
         */

        locationScore =
            Math.max(
                0,
                40 - averageTravelTime
            );

    }


    score += locationScore;


    // =========================
    // 3. Trip Feasibility
    // =========================

    if (remainingBudget > 0) {
        score += 20;
    }


    return {
        score: Number(score.toFixed(2)),
        averageTravelTime: Number(
            (totalTravelTime / poiCount).toFixed(2)
        ),
        affordable: true
    };

};


module.exports = calculateHotelScore;