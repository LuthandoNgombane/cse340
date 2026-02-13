//LN - Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

//LN - Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//LN - Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//LN - Route to build broken vehicles view
router.get("/broken", utilities.handleErrors(invController.buildBroken));

//LN - Management View
router.get("/", utilities.handleErrors(invController.buildManagement))

//LN - Classification Routes
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/addClassification", 
  validate.classificationRules(),
  validate.checkListData,
  utilities.handleErrors(invController.addClassification)
)

//LN - Inventory Routes
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/addInventory",
  validate.inventoryRules(),
  validate.checkListData,
  utilities.handleErrors(invController.addInventory)
)

//LN - Route to return inventory as JSON for the management view
router.get(
  "/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 * Route to build edit inventory view
 * ************************** */
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Process the update request
router.post(
  "/update/", 
  utilities.handleErrors(invController.updateInventory)
)

// Route to deliver the delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));

// Route to handle the actual deletion
router.post("/delete", utilities.handleErrors(invController.deleteItem));

// Apply this middleware to the following routes:
const authCheck = [utilities.checkLogin, utilities.checkAccountType]

// Example of applying to Management view
router.get("/", authCheck, utilities.handleErrors(invController.buildManagement))

// Apply authCheck to all Add/Edit/Delete routes
router.get("/addClassification", authCheck, utilities.handleErrors(invController.buildAddClassification))
router.get("/addInventory", authCheck, utilities.handleErrors(invController.buildAddInventory))
router.get("/edit/:inv_id", authCheck, utilities.handleErrors(invController.editInventoryView))
router.post("/update/", authCheck, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", authCheck, utilities.handleErrors(invController.deleteView))
router.post("/delete", authCheck, utilities.handleErrors(invController.deleteItem))

// Update the management route
router.get("/", 
  utilities.checkAccountType, // This is the gatekeeper
  utilities.handleErrors(invController.buildManagementView)
)

module.exports = router;