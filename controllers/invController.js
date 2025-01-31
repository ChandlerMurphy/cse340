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
  // const inv_id = req.params.detail
  // const data = await invModel.getInventoryItemByInvId(inv_id)
  const view = await utilities.getManagementView()
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null, 
    view,
  })
}

module.exports = invCont