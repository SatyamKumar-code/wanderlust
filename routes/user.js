const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware/middleware');
const { signupUser, signupForm,  loginForm, loginUser, logoutUser } = require('../controllers/user');

router.get("/signup", signupForm);
router.post("/signup", wrapAsync(signupUser));

router.get("/login", loginForm);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }), loginUser );

router.get("/logout", logoutUser );

module.exports = router;