const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name without spaces or special characters."),
  ]
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().escape().notEmpty().withMessage("Please provide a make."),
    body("inv_model").trim().escape().notEmpty().withMessage("Please provide a model."),
    body("inv_year").trim().escape().notEmpty().isNumeric().withMessage("Please provide a valid year."),
    body("inv_description").trim().escape().notEmpty().withMessage("Please provide a description."),
    body("inv_price").trim().escape().notEmpty().isNumeric().withMessage("Please provide a valid price."),
    body("inv_miles").trim().escape().notEmpty().isNumeric().withMessage("Please provide valid mileage."),
    body("inv_color").trim().escape().notEmpty().withMessage("Please provide a color."),
    body("classification_id").trim().escape().notEmpty().isNumeric().withMessage("Please select a classification."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkListData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // Logic to determine which view to return to
    const isClassification = req.url.includes("addClassification")
    const view = isClassification ? "./inventory/add-classification" : "./inventory/add-inventory"
    const title = isClassification ? "Add New Classification" : "Add New Vehicle"
    
    let classificationSelect = null
    if (!isClassification) {
        classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
    }

    res.render(view, {
      errors,
      title,
      nav,
      classificationSelect,
      ...req.body // This provides stickiness
    })
    return
  }
  next()
}

module.exports = validate