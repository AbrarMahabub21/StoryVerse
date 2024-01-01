const express = require("express");
const router = express.Router();

// Import User model
const User = require("../models/User");

// Middleware to check if the user is authenticated
//const { ensureAuthenticated } = require("../config/auth");
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/"); // Redirect to login or home page
};

// Route to render the profile update form
router.get("/update-profile", ensureAuthenticated, (req, res) => {
  res.render("update-profile");
});

// Route to handle profile update form submission
router.post("/update-profile", ensureAuthenticated, (req, res) => {
  const { profileImage } = req.body;

  // Update the user's profile image in the database
  User.findByIdAndUpdate(
    req.user.id,
    { profileImage },
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.redirect("/update-profile"); // Handle error
      } else {
        res.redirect("/dashboard"); // Redirect to dashboard or profile page
      }
    }
  );
});

module.exports = router;
