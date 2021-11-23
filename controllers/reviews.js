const Review = require('../models/review')
const Campground = require('../models/campgrounds')
const wrapasync = require('../utils/wrapasync')

module.exports.createreview = wrapasync(async (req, res) => {
    console.log(req.user);
    const { campid } = req.params;
    const camp = await Campground.findById(campid);
    const review = new Review(req.body);
    review.author = req.user._id;
    await review.save();
    camp.reviews.push(review);
    await camp.save();
    req.flash('success', 'Posted A New Comment!')
    res.redirect(`/campgrounds/${campid}`);
});

module.exports.deletereview = wrapasync(async (req, res) => {
    const { campid, reviewid } = req.params;
    const camp = await Campground.findById(campid).populate('reviews');
    camp.reviews = camp.reviews.filter(r => r._id != reviewid);
    await Review.findByIdAndDelete(reviewid);
    await camp.save();
    req.flash('success', 'Deleted your Comment!')
    res.redirect(`/campgrounds/${campid}`);
});
