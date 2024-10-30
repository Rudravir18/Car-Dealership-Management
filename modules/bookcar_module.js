const mongoose = require('mongoose');
const bookcarSchema = new mongoose.Schema({
    car_name:{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    company:{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    car_year: Number,
    model : {
        type: String,
        minlength: 2,
        maxlength: 20
    },
    colour :{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    rent_per_hour  : {
        type: Number,
        minlength: 2,
        maxlength: 10
    },
    engine: {
        type: String,
        maxlength: 20
    },
    type : {
        type: String,
        minlength: 2,
        maxlength: 20
    },
    fuel_type :{
        type: String,
        minlength: 2,
        maxlength: 10
    },
    extra : {
        type: String,
        minlength: 2,
        maxlength: 100
    },
    rent_or_inventory: {
        type: String,
        minlength: 2,
        maxlength: 10
    },


    booked: {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    booked_by: {
        type: String,
        minlength: 2,
        maxlength: 20
    },
    phone_no:{
        type: String,
        minlength: 2,
        maxlength: 10
    },
});
const bookcar = mongoose.model('bookcar', bookcarSchema);
module.exports = bookcar;