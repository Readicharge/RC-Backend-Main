
const express = require('express');
const router = express.Router();



// Defining the Business Routes for the RC-Customer




// *************************************************************************************************************************************//
//                                              MODULE 1 : ONBOARDING THE CUSTOMER : START
// *************************************************************************************************************************************//
const { zipCode_based_search } = require('../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/ZIPCODE-SEARCH/zipCode_Based_Installers_Determiner');
const { register_customer } = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_regiter");
const { update_address } = require("../../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-ONBOARD/REGISTER_&_ADDRESS/customer_address");
const {signIn} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-AUTH/rc-customer-sign-in");
// *************************************************************************************************************************************//
router.post('/zipcode', zipCode_based_search);
router.post("/register", register_customer);
router.put("/address/:id", update_address);

// *************************************************************************************************************************************//
router.post('/sign-in',signIn);


// *************************************************************************************************************************************//
//                                              MODULE 2 : BOOKING THE JOB : START
// *************************************************************************************************************************************//
const {determine_quotation} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-MAIN/rc-service-determiner-from-question");
router.post("/get-quotation",determine_quotation);




// *************************************************************************************************************************************//
//                                              MODULE 3 : CUSTOMER-JOB - MATERIAL DETERMINATION 
// *************************************************************************************************************************************//

const {get_material_list} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-MAIN/rc-material-list-determiner-from-questions");
router.get("/get-material-list",get_material_list);


// *************************************************************************************************************************************//
//                                              MODULE 4 : INSTALLER AVAILABILITY - DETERMINATION 
// *************************************************************************************************************************************//


const {get_those_days_which_are_not_fully_available} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-MAIN/rc-installer-daywise-determiner");
router.post("/get-installer-avail-in-month-days",get_those_days_which_are_not_fully_available);



const {installerSlots_Availability_for_Service_and_Location_and_date} = require("../RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-HELPER/RC-INSTALLER-FINDER/rc-installer-list-slots")
router.post("/get-installer-slots-availability",installerSlots_Availability_for_Service_and_Location_and_date);









// Exporting the app routes for using this in our main routes folder
module.exports = router;