const axios = require("axios");

const getRoute = async (start, end) => {
    // console.log("getRoute.js loaded");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;

    const response = await axios.get(url, {
        params: {
            access_token: process.env.MAP_TOKEN,
            geometries: "geojson"
        }
    });

    const route = response.data.routes[0];

    // console.log("RAW Mapbox duration:", route.duration);
    // console.log("CONVERTED duration:", Math.round(route.duration / 60));

    return {
        distance: (route.distance / 1000).toFixed(2), // kilometers
        duration: Math.round(route.duration / 60)  // hours
    };
};

module.exports = getRoute;