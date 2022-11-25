// ----- .env setup
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// ----- App
const express = require("express");
const app = express();
const fs = require("fs").promises;
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const Excel = require("exceljs");
const PDFDocument = require("pdf-lib").PDFDocument;
const StandardFonts = require("pdf-lib").StandardFonts;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// ----- Extended error class
const ExpressError = require("./utilities/expresserror.js");

// ----- Database models
const User = require("./models/user.js");

// ----- Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// ----- Setup of the store variable used to store user's session in MongoDB
// This is only activated when the code is pushed into production
let store
if (process.env.NODE_ENV === "production") {
    store = MongoStore.create({
        mongoUrl: process.env.MONGODB_ADDON_URI,
        touchAfter: 7 * 24 * 60 * 60,
        crypto: {
            secret: process.env.SESSION_SECRET
        }
    });
} else {
    store = new MongoStore({
        mongoUrl: "mongodb://localhost:27017/moonshot",
        secret: process.env.SESSION_SECRET,
        touchAfter: 24 * 3600
    })
    store.on('error', function (error) {
        console.log(error);
    });
}

// ----- Session & Flash middleware
// There are 2 versions of sessionConfig, one for production, the other for development.
let sessionConfig
if (process.env.NODE_ENV === "production") {
    sessionConfig = {
        store: store,
        name: `_${Math.floor(Math.random() * 1000000000000000)}`,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            sameSite: "lax",
            // The "secure" attribute is removed otherwise, the cookies cannot be read and all goes breaking
            // secure: true,
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
} else {
    sessionConfig = {
        name: `_${Math.floor(Math.random() * 1000000000000000)}`,
        secret: "placeholder",
        resave: false,
        saveUninitialized: true,
        cookie: {
            // The "samesite" and "secure" attributes are removed for , the cookies cannot be read and all goes breaking
            sameSite: "lax",
            // secure: true,
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
}

app.use(session(sessionConfig))
app.use(flash())

// ----- Helmet configuration and middleware

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
    "https://upload.wikimedia.org/wikipedia/commons/",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
    "https://fonts.bunny.net/",
    "https://upload.wikimedia.org/wikipedia/commons/",
];
const connectSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://cdnjs.cloudflare.com/",
    "https://upload.wikimedia.org/wikipedia/commons/",
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://fonts.bunny.net/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://upload.wikimedia.org/",
                // "https://images.unsplash.com/",
                // "https://res.cloudinary.com/THECLOUDINARYACCOUNTNAME/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            // The following line is added to avoid having a Content Security Policy error on Mozilla's Firefox
            // More information on this GitHub page: https://github.com/directus/directus/discussions/10928?sort=old
            'script-src-attr': null
        },
    })
);

// ----- Database connection

if (process.env.NODE_ENV !== "production") {
    mongoose.connect("mongodb://localhost:27017/spreadshot", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(function () {
            console.log(`* OK * SPREADSHOT PROJECT (Dev.) - Database connection OK (Mongoose)`);
        })
        .catch(function (err) {
            console.log(`*!* WARNING *!* SPREADSHOT PROJECT (Dev.) - Database connection ERROR (Mongoose)`);
            console.log(err);
        });
} else {
    mongoose.connect(process.env.MONGODB_ADDON_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(function () {
            console.log(`${colors.black.bgBrightGreen("* OK *")} MOONSHOT PROJECT (Prod.) - Database connection OK (Mongoose)`);
        })
        .catch(function (err) {
            console.log(`${colors.brightYellow.bgBrightRed("*!* WARNING *!*")} MOONSHOT PROJECT (Prod.) - Database connection ERROR (Mongoose)`);
            console.log(err);
        });
}


// ----- Passport setup and middleware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")
    res.locals.warning = req.flash("warning")
    res.locals.error = req.flash("error")
    res.locals.info = req.flash("info")
    next()
})

// ----- Initialization functions
// --- The purpose of the function below is to render a dummy init function
// --- It can easiliy be substituted with another function if needed

const initDummyFunction = require("./utilities/initFunction.js");
initDummyFunction();

// ----- Routes HOME & START
app.get("/", function (req, res) {
    res.render("index/homepage.ejs");
});

// ----- Routes ABOUT

const aboutRoutes = require("./routes/about.js")
app.use("/about", aboutRoutes)

// ----- Routes USER

const userRoutes = require("./routes/user.js")
app.use("/user", userRoutes)

// ----- Routes for ERROR HANDLING

app.all("*", function (req, res, next) {
    next(new ExpressError("Page not found", 404));
});

app.use(function (err, req, res, next) {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error/error500.ejs", { err });
    console.log(`*!* ERROR *!* - Status Code: ${statusCode} - Message: ${message}`);
    console.log(err);
});

// ----- Port listening

if (process.env.NODE_ENV === "production") {
    app.listen(process.env.PORT, '0.0.0.0', function () {
        console.log(`* OK * SPREADSHOT PROJECT (Prod.) - App is listening on port ${process.env.PORT}`);
    });
} else {
    const port = 3000
    app.listen(port, function () {
        console.log(`* OK * SPREADSHOT PROJECT (Dev.) - App is listening on port 3000 - http://localhost:${port}/`);
    });
}