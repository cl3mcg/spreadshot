// ----- Require imports
// Insert here any module that need to be require for the app to work
const express = require('express');
const router = express.Router({ mergeParams: true });

// ----- Database models
// Insert here any database model that would be necessary for the app to work

// ----- Ressources required
// Insert here any ressource or function that would be necessary

// ----- catchAsync middleware used to handle Async functions errors
const catchAsync = require("../utilities/catchasync.js");

// ----- Middleware used

const {
    // ----- isLoggedIn middleware used to check if the user is properly logged in - Check the value of req.user stored in Express Session
    isLoggedIn
} = require("../utilities/middleware.js");

// ----- Controllers used for ABOUT

const aboutCtrl = require("../controllers/about_ctrl.js");

// ----- Routes ABOUT
// Insert here any controller that need to be triggered when a route is hit
router.get("/", aboutCtrl.renderAboutPage);
router.get("/secret", isLoggedIn, aboutCtrl.renderSecretPage);

// ----- Exporting the routes to make these available in the app
module.exports = router;