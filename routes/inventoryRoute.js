// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classValidate = require('../utilities/class-validation')
const invValidate = require('../utilities/inventory-validation')

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by item view
router.get("/detail/:detail", utilities.handleErrors(invController.buildByInvId));

// Route to build the add classification view
router.get("/addClass", utilities.handleErrors(invController.addClassification));

// Route to use the inventory controller to proccess the route and return JSON data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to get the view required to modify inventory data through the website.
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInvItemView))

// Route to get the view required to delete inventory data through the website.
router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteInvItemView))

// Route to actually edit and update the DB for an inventory item
router.post("/drop/", utilities.handleErrors(invController.dropInventory))

// Route to actually edit and update the DB for an inventory item
router.post(
    "/update/", 
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to send newly built classification views to the database
router.post(
    "/addClass",
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassificationtoDB)
)

// Route to build the add inventory view
router.get("/addInv", utilities.handleErrors(invController.addInventory));

// Route to send newly built inventory views to the database
router.post(
    "/addInv",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventorytoDB)
)

module.exports = router;