const mongoose = require('mongoose');


// For the admin 
const adminSchema = new mongoose.Schema({
    // The Unique ID of the Admin
    readicharge_unique_id: {
        type: String,
        required: true
    },
    // The Sequence Number of the Admin
    sequence_number: {
        type: Number,
        required: true
    },
    // The Image of the Admin
    admin_image: {
        type: Buffer, // Used 'Buffer' data type to store binary data (image)
    },
    // The MIME Type of the Image
    imageMimeType: {
        type: String, // Stored the MIME type of the image (e.g., 'image/jpeg', 'image/png', etc.)
    },
    // The Name of the Admin
    name: {
        type: String,
        required: true
    },
    // The Email of the Admin
    email: {
        type: String,
        required: true,
        unique: true
    },
    // The Phone Number of the Admin
    phoneNumber: {
        type: String,
        required: true
    },
    // The Address of the Admin
    address: {
        type: String,
        required: true
    },
    // The Password of the Admin
    password: {
        type: String,
        required: true
    },
    // We will have 7 Primary types of services with which we are going to help the Admins 
    roles: {
        type: [{
            type: String,
            enum: ['Installer', 'Customer', 'Service', 'Company', 'Material', 'Payments', 'Labor', 'Booking', 'Helpdesk']
        }],
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
