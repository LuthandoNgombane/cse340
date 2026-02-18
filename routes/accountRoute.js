//LN - routes/accountRoute.js
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//LN - Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//LN - Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//LN - Route to build account management view
router.get(
"/",
utilities.checkLogin,
utilities.handleErrors(accountController.buildManagementView))

//LN - Process the registration data 
router.post(
  "/register", 
  regValidate.registationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
)

// Route to deliver the account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Process the account information update
router.post(
  "/update-info",
  regValidate.updateAccountRules(), 
  regValidate.checkUpdateData,     
  utilities.handleErrors(accountController.updateAccount)
)

// Process the password change
router.post(
  "/update-password",
  regValidate.passwordRules(),      
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))


module.exports = router