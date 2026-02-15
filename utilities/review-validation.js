const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // review_text is required and must be string
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a review."), // Feedback for the user
  ]
}

/* ******************************
 * Check data and return errors or continue to controller
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    req.flash("notice", "Please provide a valid review.")
    res.redirect(`/inv/detail/${inv_id}`)
    return
  }
  next()
}

module.exports = validate