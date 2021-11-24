const Campground = require('../models/campgrounds')
const wrapasync = require('../utils/wrapasync')
const { cloudinary } = require('../cloudinary/index');
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mapbox({ accessToken: process.env.MAPBOX_TOKEN });



module.exports.allcampgrounds = wrapasync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

module.exports.createform = wrapasync(async (req, res) => {
    res.render('campgrounds/new');
})

module.exports.getcampground = wrapasync(async (req, res) => {
    const { id } = req.params;

    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'                   // nested populated - populate reviews on campground then populate author on reviews
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot Find that Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
});

module.exports.createcampground = wrapasync(async (req, res) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1 // number of results
    }).send();
    if (geodata.body.features.length == 0) {
        req.flash('error', 'Please enter a valid location!');
        return res.redirect('/campgrounds/new');
    }
    const c = new Campground(req.body);
    c.author = req.user._id;

    c.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename
    }));
    // res.send(geodata.body.features[0].geometry.coordinates);  // contains [longitude,latitude]
    c.geometry = geodata.body.features[0].geometry; // returns in GeoJSON format {"type":"Point","coordinates":[]}
    await c.save();
    req.flash('success', 'Successfully made a New Campground!')
    res.redirect(`/campgrounds/${c.id}`)
})

module.exports.editform = wrapasync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot Find that Campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
})

module.exports.editcampground = wrapasync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body);
    req.flash('success', 'Updated Campground!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports.deletecampground = wrapasync(async (req, res) => {
    // islogged function in this case takes us to /:id as a get if user not logged in
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground!')
    res.redirect(`/campgrounds`)
})

module.exports.uploadimages = wrapasync(async (req, res) => {
    const { id } = req.params;
    if (req.files.length == 0) {
        req.flash('error', 'Choose images to Upload!');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findById(id);
    camp.images = camp.images.concat(req.files.map((file) => ({
        url: file.path,
        filename: file.filename
    })));
    await camp.save();
    req.flash('success', 'Image Uploaded!')
    res.redirect(`/campgrounds/${id}`)
})
module.exports.deleteimg = wrapasync(async (req, res) => {
    const { id } = req.params;
    const { path, filename } = req.query;
    const camp = await Campground.findById(id);
    camp.images = camp.images.filter(img => img.url != path);
    await camp.save();
    await cloudinary.uploader.destroy(filename);
    req.flash('success', 'Deleted Image!')
    res.redirect(`/campgrounds/${id}`);
})