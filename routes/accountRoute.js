// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build the account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the register account login view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

module.exports = router;