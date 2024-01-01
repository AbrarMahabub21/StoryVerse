const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const router = express.Router();

// @desc  auth with google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc  google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc    logout user
// route    /auth/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Redirect or respond as needed after logout
    res.redirect("/");
  });
});
module.exports = router;
