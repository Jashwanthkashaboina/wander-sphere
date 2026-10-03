const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");
const preferenceController = require("../controllers/preferences.js");


// Create preferences
router.post("/", isLoggedIn, preferenceController.createPreference);

// Get preferences
router.get("/", isLoggedIn, preferenceController.getPreference);

// Update preferences
router.put("/", isLoggedIn, preferenceController.updatePreference);


module.exports = router;