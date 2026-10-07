const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const { getPOI } = require("../controllers/poi");




router.get("/:id/route/:destinationId", isLoggedIn, getPOI);


module.exports = router;