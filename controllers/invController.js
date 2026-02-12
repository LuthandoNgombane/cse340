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
 * Deliver Management View
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Deliver Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  
  if (result) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    let nav = await utilities.getNav()
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 * Deliver Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 * Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  const { 
    inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id 
  } = req.body

  const result = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.")
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      // Provide variables for stickiness
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
  }
}

/* ***************************
 * Build Internal Server Error
 * ************************** */
invCont.buildBroken = async function (req, res, next) {
  throw new Error("This is a planned 500 error for Task 3.")
}

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id, inv_make, inv_model, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_year, inv_miles, inv_color,
    classification_id,
  } = req.body // Collect all data from the form 

  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_year, inv_miles, inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/") // Return to management view on success 
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
      classification_id
    })
  }
}


/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 * Delete Inventory Data
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont