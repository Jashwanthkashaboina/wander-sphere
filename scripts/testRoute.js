require("dotenv").config();

const getRoute = require("../utils/getRoute.js");

const start = [78.4747, 17.3616]; // Charminar
const end = [78.4804, 17.3713];   // Salar Jung Museum

getRoute(start, end)
    .then(route => {
        console.log("Distance:", route.distance, "meters");
        console.log("Duration:", route.duration, "seconds");
    })
    .catch(err => {
        console.error("Routing Error:", err.response?.data || err.message);
    });