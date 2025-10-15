const express = require("express");
const router = express.Router();

// GET contact page
router.get("/", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
    nav: "", 
  });
});

router.post("/send", (req, res) => {
  const { name, email, message } = req.body;
  console.log("📩 New contact message:", { name, email, message });
  req.flash("notice", "Thank you for contacting us! We'll get back to you soon.");
  res.redirect("/contact");
});


module.exports = router;