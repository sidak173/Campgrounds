const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewschema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model("Review", reviewschema)