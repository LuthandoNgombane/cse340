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

module.exports = router;