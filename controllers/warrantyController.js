const warModel = require("../models/warranty-model")
const utilities = require("../utilities/")

const warCont = {}

warCont.buildWarrantyView = async function (req, res, next) {
    const data = await warModel.getWarranty()
    const view = await utilities.buildWarrantyList(data)
    let nav = await utilities.getNav()
    res.render("./warranty/warranty", {
        title: "Optional Warranties",
        nav,
        errors: null,
        view,
    })
}

module.exports = warCont