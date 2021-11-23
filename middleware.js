const Campground = require('./models/campgrounds')
const Review = require('./models/review')
const multer = require('multer') // to handle file forms(multipart/form-data), makes req.files object to handle file data


const { campgroundschema } = require('./validationschemas')
const expresserror = require('./utils/error');
const { reviewschema } = require('./validationschemas')



module.exports.validateReview = (req, res, next) => {
    const result = reviewschema.validate(req.body);
    if (result.error) {
        // console.log(result.error.details)
        const msg = result.error.details.map(e => e.message).join();
        throw new expresserror(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateCampground = (req, res, next) => {
    console.log(req.body);
    // validates data before saving with mongoose -> joi is used as a validation service on top of mongoose
    const result = campgroundschema.validate(req.body);
    if (result.error) {
        // console.log(result.error.details)
        const msg = result.error.details.map(e => e.message).join();
        throw new expresserror(msg, 400);
    }
    else {
        next();
    }
}


module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isauthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isreviewauthor = async (req, res, next) => {
    const { campid, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${campid}`);
    }
    next();
}

