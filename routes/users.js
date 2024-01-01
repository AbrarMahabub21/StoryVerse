// routes/users.js

const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

// User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/signup", (req, res) => res.render("signup"));

// Register Handle
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      req.flash(
        "error_msg",
        "Username is already taken. Please choose another."
      );
      return res.redirect("/users/signup");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
