// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build the account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the register account login view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build the management account view
router.get("/", utilities.handleErrors(accountController.buildManagement));

// Route to post the registered account details to the database
// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;