// Needed Resources 
const express = require("express")
const router = new express.Router() 
const warrantyController = require("../controllers/warrantyController")
const utilities = require("../utilities")
// const classValidate = require('../utilities/class-validation')
// const invValidate = require('../utilities/inventory-validation')

// Route to get the Warranty Page View
router.get("/", utilities.handleErrors(warrantyController.buildWarrantyView));

module.exports = router;