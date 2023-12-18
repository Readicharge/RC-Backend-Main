const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // The Unique ID of the Customer
    readicharge_unique_id: {
        type: String,
        required: true
    },
    // The Sequence Number of the Customer
    sequence_number: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    phone_number: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    zip_code: {
        type: String,
        required: false,
    },
    address_line1: {
        type: String,
        required: false,
    },
    address_line2: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    // Auth related fields
    isRegisteration_completed: {
        type: Boolean,
        required: false,
        default:false
    },
    isLogged_in: {
        type: Boolean,
        required: false,
        default:false
    },


});

const Customer = mongoose.model('Customer', userSchema);

module.exports = Customer;
