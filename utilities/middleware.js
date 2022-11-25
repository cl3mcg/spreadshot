// ----- Ressources required
// Insert here any module that need to be require for the app to work

// ----- Database models
// Insert here any database model that would be necessary for the app to work

// ----- Ressources required
// Insert here any ressource or function that would be necessary

// ----- Extended error class
const ExpressError = require("../utilities/expresserror.js");

// ----- Middleware functions

const isLoggedIn = function (req, res, next) {
  // console.log(`The req.user is: ${req.user}`);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("warning", "You must be logged in.")
    return res.redirect("/user/login")
  }
  next()
}

module.exports = {
  isLoggedIn,
}
