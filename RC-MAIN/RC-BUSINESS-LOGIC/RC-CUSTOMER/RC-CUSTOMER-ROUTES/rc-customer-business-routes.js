
const express = require('express');
const router = express.Router();



// Defining the Business Routes for the RC-Customer

// Zip Code based installer Search
const {zipCode_based_search} = require('../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/ZIPCODE-SEARCH/zipCode_Based_Installers_Determiner');
const {register_customer} = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_regiter");
const {update_address} = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_address");



// Using the Routes here


// Zip Code based installer search 
router.get('/zipcode', zipCode_based_search);
// Register the Customer 
router.post("/register",register_customer);
// Address Enrollment for the registeration process
router.put("/address/:id",update_address);












// Exporting the app routes for using this in our main routes folder
module.exports = router;