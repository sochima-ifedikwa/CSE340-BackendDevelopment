// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController.js")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;
