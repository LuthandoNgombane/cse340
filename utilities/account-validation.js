const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    //LN - firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    //LN - lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    //LN - valid email is required
    body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
          const account_id = req.body.account_id
          const account = await accountModel.getAccountByEmail(account_email)
          // LN - if account exists 
          if (account && account.account_id != account_id) {
            throw new Error("Email exists. Please use a different email.")
          }
        }),

    //LN - password is required and must be strong
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // Valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 * Account Update Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().escape().notEmpty().withMessage("First name is required."),
    body("account_lastname").trim().escape().notEmpty().withMessage("Last name is required."),
     //LN - valid email is required
    body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
          const account_id = req.body.account_id
          const account = await accountModel.getAccountByEmail(account_email)
          // LN - if account exists 
          if (account && account.account_id != account_id) {
            throw new Error("Email exists. Please use a different email.")
          }
        }),
      body("account_type")
        .trim()
        .notEmpty()
        .isIn(['Client', 'Employee', 'Admin'])
        .withMessage("Please select a valid account type."),
  ]
}

/* ******************************
 * Check update data and return errors or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      ...req.body,
    })
    return
  }
  next()
}

/* **********************************
 * Password Validation Rules
 * ********************************* */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}


module.exports = validate
