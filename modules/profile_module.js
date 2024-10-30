const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    username :String,
    password: String,
    fname :String,
    lname: String,
    email: String,
    contact: Number,
    role: String,
});
const profile = mongoose.model('profile', ProfileSchema);

module.exports = profile;