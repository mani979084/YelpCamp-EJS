const express = require('express');
const router = express.Router();
const catchAsync = require('../error/catchAsync')
const campgrounds = require('../controllers/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const Campground = require('../models/campground')

const upload = multer({ storage });


const { isLoggedIn, isAuthor, validateCamp } = require('../middleware')

router.route('/')
    .get(catchAsync(campgrounds.renderIndex))
    .post(isLoggedIn,
        upload.array('images'),
        validateCamp, catchAsync(campgrounds.createCamp))


router.get('/new', isLoggedIn, campgrounds.renderNewCamp)

router.route('/:id')
    .get(catchAsync(campgrounds.renderShow))
    .put(isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.editCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit))

router.route('/:id/editphoto')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditphoto))
    .put(isLoggedIn, isAuthor, upload.array('images'), catchAsync(campgrounds.editphoto))


module.exports = router;
