const mongoose = require('mongoose');
const accessdeniedSchema = new mongoose.Schema({
    username :{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    role: {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    date:{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    page: {
        type: String,
        minlength: 2,
        maxlength: 10
    },
});
const accessdenied = mongoose.model('accessdenied', accessdeniedSchema);

module.exports = accessdenied;