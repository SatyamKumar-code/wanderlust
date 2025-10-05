const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); 
const { isLoggedIn, isOwner, validateListing } = require('../middleware/middleware.js');
const { index, newListing, showListing, createListing, editListing, updateListing, distroyListing } = require('../controllers/listing.js');



// index Route
router.get("/", wrapAsync(index));



// new Route
router.get("/new",isLoggedIn, newListing );

// show Route
router.get("/:id", wrapAsync(showListing));

//Create Route
router.post("/",isLoggedIn, validateListing,
  wrapAsync(createListing)
);

// edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(editListing));

//Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

// Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(distroyListing));

module.exports = router;