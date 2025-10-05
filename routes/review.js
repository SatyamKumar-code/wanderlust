const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware/middleware.js');
const { postReview, destroyReview } = require('../controllers/review.js');


router.post("/", isLoggedIn, validateReview, wrapAsync(postReview));
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(destroyReview))

module.exports = router;