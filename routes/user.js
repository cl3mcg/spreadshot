// ----- Require imports
// Insert here any module that need to be require for the app to work
const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

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

const userCtrl = require("../controllers/user_ctrl.js");

// ----- Routes ABOUT
// Insert here any controller that need to be triggered when a route is hit


router.route("/login")
    .get(userCtrl.renderLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), userCtrl.userLogin)

router.get("/logout", userCtrl.userLogout);

router.get("/:userId", userCtrl.renderUserPage);

router.post("/register", userCtrl.userRegister);

router.post("/recover", userCtrl.userRecover);

router.post("/:userId/changeUsername", userCtrl.userChangeUsername);

router.post("/:userId/changeEmail", userCtrl.userChangeEmail);

router.post("/:userId/changePassword", userCtrl.userChangePassword);

// ----- Exporting the routes to make these available in the app
module.exports = router;