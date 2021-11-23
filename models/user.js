const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocal = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate");



const UserSchema = new Schema({
    email: {
        type: String,
        required: true,  // wont specify username and password (passport)
        unique: [true,'This email has already been taken.Please sign-up with a unique Email.']  // not considered validation 
    }
});
UserSchema.plugin(passportlocal); // adds field of username and hashed_password,salt to userschema, it also adds validation and specific fns associated with those fields
UserSchema.plugin(findOrCreate);


module.exports = mongoose.model('User', UserSchema);

