const contactModel = require("../models/contactModel");
const utilities = require("../utilities");

const contactController = {};

contactController.buildContactForm = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("contact/contact", {
    title: "Contact Us",
    nav,
    message: null,
    errors: null,
  });
};

contactController.submitMessage = async function (req, res) {
  const nav = await utilities.getNav();
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    req.flash("notice", "All fields are required.");
    return res.status(400).render("contact/contact", {
      title: "Contact Us",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  }

  try {
    await contactModel.addMessage(name.trim(), email.trim(), message.trim());
    req.flash("success", "Your message has been sent successfully!");
    res.status(201).render("contact/contact", {
      title: "Contact Us",
      nav,
      message: req.flash("success"),
      errors: null,
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    req.flash("error", "There was a problem sending your message.");
    res.status(500).render("contact/contact", {
      title: "Contact Us",
      nav,
      message: req.flash("error"),
      errors: null,
    });
  }
};

module.exports = contactController;