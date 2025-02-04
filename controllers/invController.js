const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    errors: null,
    grid,
  })
}

/* ***************************
 *  Build inventory by item view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.detail
  const data = await invModel.getInventoryItemByInvId(inv_id)
  const view = await utilities.buildInventoryItem(data)
  let nav = await utilities.getNav()
  // console.log(data.rows)
  const itemYear = data[0].inv_year
  const itemMake = data[0].inv_make
  const itemModel = data[0].inv_model
  res.render("./inventory/item", {
    title: itemYear + ' ' + itemMake + ' ' + itemModel,
    nav,
    errors: null, 
    view,
  })
}

/* ***************************
 *  Build page by management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  // This code below was created by us but not by the assingments. This is how I 
  // built the view of the body instead of putting it in the view file.
  const view = await utilities.getManagementView()
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null, 
    view,
    classificationSelect,
  })
}

/* ****************************************
*  Build the add classification view
* *************************************** */
invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Process New Classification View
* *************************************** */
invCont.addClassificationtoDB = async function (req, res) {
  let nav = await utilities.getNav()
  const view = await utilities.getManagementView()
  const { classification_name } = req.body
  
  const classResult = await invModel.addClassToDB(
    classification_name
  )
  
  if (classResult) {
    req.flash("notice", `Congratulations, you have added ${classification_name} as a vehicle classification option.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      view,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Build the add classification view
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    selectList
  })
}

/* ****************************************
*  Process New Inventory View
* *************************************** */
invCont.addInventorytoDB = async function (req, res) {
  let nav = await utilities.getNav()
  const view = await utilities.getManagementView()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  
  const invResult = await invModel.addInvToDB(
    classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color
  )
  
  if (invResult) {
    req.flash("notice", `Congratulations, you have added a new vehicle to the inventory.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      view,
    })
  } else {
    req.flash("notice", "Sorry, the vehicle failed to be added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont