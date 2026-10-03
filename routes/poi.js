const express = require("express");
const router = express.Router();

const POI = require("../models/poi.js");
const getRoute = require("../utils/getRoute.js");


router.get("/:id/route/:destinationId", async (req, res) => {

    try {

        const { id, destinationId } = req.params;

        const startPOI = await POI.findById(id);
        const destinationPOI = await POI.findById(destinationId);

        if (!startPOI || !destinationPOI) {
            return res.status(404).json({
                message: "POI not found"
            });
        }

        const start = [
            startPOI.location.longitude,
            startPOI.location.latitude
        ];

        const end = [
            destinationPOI.location.longitude,
            destinationPOI.location.latitude
        ];

        const route = await getRoute(start, end);

        res.json({
            from: startPOI.name,
            to: destinationPOI.name,
            distance: route.distance,
            duration: route.duration
        });

    } catch (err) {

        console.error("POI Routing Error:", err);

        res.status(500).json({
            message: "Unable to calculate route"
        });
    }
});


module.exports = router;