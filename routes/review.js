const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../error/catchAsync')
const reviews = require('../controllers/review')
const { isReviewAuthor, isLoggedIn, validateReview } = require('../middleware')

router.route('/')
    .get(reviews.redirectShow)
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.route('/:reviewid')
    .get(reviews.redirectShow)
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;