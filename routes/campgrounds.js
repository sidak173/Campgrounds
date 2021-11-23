const express = require('express');
const router = express.Router();
const methodOverride = require('method-override')
const { isloggedin, isauthor, validateCampground } = require('../middleware');
const { allcampgrounds, campcontroller, createform, getcampground, createcampground, editform, editcampground, deletecampground, uploadimages, deleteimg } = require('../controllers/campgrounds')
const multer = require('multer') // to handle file forms(multipart/form-data), makes req.files object to handle file data
const { cloudinary, storage } = require('../cloudinary/index');

const upload = multer({ storage })

router.route('/')
    .get(allcampgrounds)
    .post(isloggedin, upload.array('images'), validateCampground, createcampground)



router.get('/new', isloggedin, createform)

router.route('/:id')
    .get(getcampground)
    .put(isloggedin, isauthor, validateCampground, editcampground)
    .delete(isloggedin, isauthor, deletecampground)

router.patch('/:id/upload', isloggedin, isauthor, upload.array('images'), uploadimages)

router.get('/:id/edit', isloggedin, isauthor, editform)

router.delete('/:id/deleteimg', isloggedin, isauthor, deleteimg);

module.exports = router;