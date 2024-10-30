const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
    car_name:  {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    company:{
        type: String,
        minlength: 2,
        maxlength: 10
    },
    car_year: {
        type: Number,
        minlength: 2,
        maxlength: 10
    },
    model : {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    colour :{
        type: String,
        minlength: 2,
        maxlength: 10
    },
    rent_per_hour  : {
        type: Number,
        minlength: 2,
        maxlength: 10
    },
    engine: {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    type : {
        type: String,
        minlength: 2,
        maxlength: 10
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
    posted_by : {
        type: String,
        minlength: 2,
        maxlength: 100
    },
    updated_last:{
        type: String,
        minlength: 2,
        maxlength: 100
    },
    updated_by : {
        type: String,
        minlength: 2,
        maxlength: 100
    },
    filename: {
        type: String,
        minlength: 2,
        maxlength: 100
    },
    originalname: {
        type: String,
        minlength: 2,
        maxlength: 100
    },
    path: {
        type: String,
        minlength: 2,
        maxlength: 100
    },
});
const rental = mongoose.model('rental', rentalSchema);
module.exports = rental;