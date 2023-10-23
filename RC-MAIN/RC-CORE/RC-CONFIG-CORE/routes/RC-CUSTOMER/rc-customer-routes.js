
const express = require('express');
const router = express.Router();

// Core Module Calls and opeartions
const {createCustomer , updateCustomer} = require("../../controllers/RC-CUSTOMER/rc-customer-controller");


// Business Logic Helper Operations
// const {service_determiner} = require("../../../../RC-BUSINESS-LOGIC/RC-QUOTATION/RC-SERVICE-DETERMINER/rc-service-determiner")
// const {material_cost_determinatoin_from_questions} = require("../../../../RC-BUSINESS-LOGIC/RC-QUOTATION/RC-MATERIAL-DETERMINER/rc-material-determiner")



// Create a new customer ( Resgister a new customer )
router.post('/', createCustomer);
// Udate a customer ( Used for address page )
router.put("/:id",updateCustomer);



// Business Related Routes 
// Testing Cases


// router.get('/zipCode_based_search',zipCode_based_search);
// router.get("/service_determiner",service_determiner);
// router.get("/material_determiner",material_cost_determinatoin_from_questions);





module.exports = router;
