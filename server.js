/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const usersRoute = require("./routes/usersRoute");
const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const bodyParser = require("body-parser")


/* ***********************
 * Middleware
 * ************************/
//  app.use(favicon(path.join(__dirname, 'public', 'images', 'site', 'favicon.ico')))
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)


/* ***************************************************************
 * locals allows to access loggedin, user, & others in any EJS partial.
 *****************************************************************/
app.use((req, res, next) => {
  const account = res.locals.account || req.session.user || null;
  res.locals = {
    images: "/images/site/icon.png",
    year: new Date().getFullYear(),
    siteName: "CSE Motors",
  };
  res.locals.loggedin = !!account
  res.locals.user = account
  next()
})

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)


// Account routes
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ************************************************
* Enhanced and more general Express Error Handler *
***************************************************/
app.use(async (err, req, res, next) => {
  try {
    // Build any shared UI elements (navigation, footer, etc.)
    const nav = await utilities.getNav()
    const footer = utilities.getFooter?.() // Example: optional footer helper

    // Log the error for debugging
    console.error(`Error at "${req.originalUrl}":`, err)

    // Decide on status and user-facing message
    let status = err.status || 500;
    let message;

    switch (status) {
      case 400:
        message = "Bad Request. Please check your input.";
        break;
      case 401:
        message = "Unauthorized. Please log in to continue.";
        break;
      case 403:
        message = "Forbidden. You don't have permission to view this resource.";
        break;
      case 404:
        message = err.message || "Page not found.";
        break;
      case 500:
      default:
        message = err.message || "Oh no! There was a crash. Please try again.";
        break;
    }

    // Render custom error view
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav,
      footer: `${status} Error`, // Other shared elements like footer, header... can be included
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    })
  } catch (handlerError) {
    // If something fails *inside* the error handler itself
    console.error("Error while handling error:", handlerError)
    res
      .status(500)
      .send("Critical failure while handling an error. Please try later.")
  }
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// app.use(async (err, req, res, next) => {
//   let nav="";
//   try {
//     nav = await utilities.getNav();
//   } catch (e) {
//     nav = ""; // fallback if nav fails
//   }
//   res.status(err.status || 500);
//   res.render("error", {
//     title: "Error",
//     message: err.message,
//     error: err,
//     nav,
    
//   });
// });
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})