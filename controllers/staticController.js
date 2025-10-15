const utilities = require("../utilities/");

const staticController = {};

staticController.buildContact = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("contact/contact", {
      title: "Contact Us",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error building contact page:", error);
    next(error);
  }
};

module.exports = staticController;