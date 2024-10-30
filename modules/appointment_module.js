const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    car_name:{
        type: String,
        minlength: 2,
        maxlength: 20
    },
    car_year: Number,
    model: {
        type: String,
        minlength: 2,
        maxlength: 20
    },
    category: {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    fuel_type : {
        type: String,
        minlength: 2,
        maxlength: 10
    },
    booked_by:  {
        type: String,
        minlength: 2,
        maxlength: 20
    },
    phone_no: {
        type: Number,
        minlength: 10,
        maxlength: 10
    },
    discount_app : {
        type: String,
        minlength: 2,
        maxlength: 3
    },
});
const appointment = mongoose.model('appointment',appointmentSchema );
module.exports = appointment;