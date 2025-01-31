const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
      // valid classification id is required
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid classification class."), // on error this message is sent.

      // valid make name is required, must be 3 characters long at min
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid make name."), // on error this message is sent.
        
      // valid make name is required, must be 3 characters long at min
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid model name."), // on error this message is sent.

      // valid description is required
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid inventory description."), // on error this message is sent.

      // valid image path is required. For now there are no additional rules until further instructed.
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid image path."), // on error this message is sent.

      // valid thumbnail path is required. For now there are no additional rules until further instructed.
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid thumbnail path."), // on error this message is sent.

      // valid thumbnail path is required.
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isDecimal()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid price format."), // on error this message is sent.

      // valid year format is required. 
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1, max: 4 })
        .withMessage("Please provide a valid year format."), // on error this message is sent.

      // valid miles format is required.
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid mile format."), // on error this message is sent.

      // valid color is required. For now there are no additional rules until further instructed.
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid color."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add Vehicle",
        nav,
        classification_id, 
        inv_make, inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
      })
      return
    }
    next()
}

module.exports = validate