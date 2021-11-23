const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary/index');


const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    } ,
    images: [
        {
            url: String, // path / src
            filename: String  // campgrounds/something
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
CampgroundsSchema.post('findOneAndDelete', async (camp) => {   // querymiddleware. There are 4 types of middleware in mongoose
    if (camp) {
        await Review.deleteMany({ id: { $in: camp.reviews } });
        for (let img of camp.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
})

module.exports = mongoose.model('Campground', CampgroundsSchema);