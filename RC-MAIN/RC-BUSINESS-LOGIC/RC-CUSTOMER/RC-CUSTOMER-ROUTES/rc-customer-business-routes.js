
const express = require('express');
const router = express.Router();



// Defining the Business Routes for the RC-Customer




// *************************************************************************************************************************************//
//                                              MODULE 1 : ONBOARDING THE CUSTOMER : START
// *************************************************************************************************************************************//
const { zipCode_based_search } = require('../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/ZIPCODE-SEARCH/zipCode_Based_Installers_Determiner');
const { register_customer } = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_regiter");
const { update_address } = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_address");
// *************************************************************************************************************************************//
router.get('/zipcode', zipCode_based_search);
router.post("/register", register_customer);
router.put("/address/:id", update_address);

// *************************************************************************************************************************************//
//                                             MODULE 1 : ONBOARDING THE CUSTOMER :END
// *************************************************************************************************************************************//



// *************************************************************************************************************************************//
//                                              MODULE 2 : BOOKING THE JOB : START
// *************************************************************************************************************************************//
const {determine_quotation} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-MAIN/rc-service-determiner-from-question");
router.post("/get-quotation",determine_quotation);














// Exporting the app routes for using this in our main routes folder
module.exports = router;