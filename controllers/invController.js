const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || !data.length) {
      return res.status(404).send('No vehicles found for this classification')
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    // call the correct model function
    const vehicle = await invModel.getInventoryByInvId(inv_id)
    if (vehicle) {
      const nav = await utilities.getNav()
      const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`
      // pass the vehicle object to the view (detail.ejs expects `vehicle`)
      res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        vehicle,
      })
    } else {
      res.status(404).send("Vehicle not found")
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont