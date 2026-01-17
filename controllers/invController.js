const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventoryId)
  const data = await invModel.getInventoryByInventoryId(inventoryId)
  const grid = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const className =  data.inv_year + " " + data.inv_make + " " + data.inv_model
  res.render("./inventory/car-details", {
    title: className,
    nav,
    grid,
  })
}

/* ***************************
 * Build Internal Server Error
 * ************************** */
invCont.buildBroken = async function (req, res, next) {
  throw new Error("This is a planned 500 error for Task 3.")
}

module.exports = invCont