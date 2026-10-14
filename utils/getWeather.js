const axios = require("axios");

const getWeather = async (latitude, longitude) => {
    const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
            params: {
                lat: latitude,
                lon: longitude,
                appid: process.env.OPENWEATHER_API_KEY,
                units: "metric"
            }
        }
    );

    return {
        temperature: response.data.main.temp,
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        rain: response.data.rain || null
    };
};

module.exports = getWeather;