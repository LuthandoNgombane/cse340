// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

//Route to build broken vehicles view
router.get("/broken", utilities.handleErrors(invController.buildBroken));

// Task 1: Management View
router.get("/", utilities.handleErrors(invController.buildManagement))

// Task 2: Classification Routes
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post(
  "/addClassification", 
  validate.classificationRules(),
  validate.checkListData,
  utilities.handleErrors(invController.addClassification)
)

// Task 3: Inventory Routes
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post(
  "/addInventory",
  validate.inventoryRules(),
  validate.checkListData,
  utilities.handleErrors(invController.addInventory)
)




module.exports = router;