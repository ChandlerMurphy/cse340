const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
      // valid classification name is required, must be string, and cannot already exist in the DB
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha() // Should check if the provided answer has spaces or not
        .withMessage("Please provide a valid classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClassification(classification_name)
        if (classExists){
            throw new Error("Classification exists. Please refer to existing class or add a different class.")
        }
        }),
    ]
}

/* ******************************
 * Check data and return errors or continue to adding new classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

module.exports = validate