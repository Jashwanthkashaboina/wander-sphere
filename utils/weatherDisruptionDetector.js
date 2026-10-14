const detectWeatherDisruption = (weather, poi) => {

    if (poi.indoorOutdoor === "indoor") {
        return false;
    }

    if (
        weather.condition === "Thunderstorm" ||
        weather.condition === "Heavy Rain"
    ) {
        return true;
    }

    return false;
};

module.exports = detectWeatherDisruption;