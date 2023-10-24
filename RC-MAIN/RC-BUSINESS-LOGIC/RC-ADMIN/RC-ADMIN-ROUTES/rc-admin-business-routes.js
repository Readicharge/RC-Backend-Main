
const express = require('express');
const router = express.Router();



// *************************************************************************************************************************************//
//                                              MODULE 1 : SERVICE - ADMIN
// *************************************************************************************************************************************//

const {createServiceServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-create-service");
router.post("/service-create",createServiceServer);


const {sign_in_admin} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-AUTH/rc-admin-sign-in");
router.post("/sign-in",sign_in_admin);


const {getServiceListServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-get-service-list");
router.get("/service-get-all",getServiceListServer);


const {createTimeServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-TIME/rc-admin-service-time-create")
router.post("/service-time-create",createTimeServer);


const {getAllTimesServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-TIME/rc-admin-service-time-get-all");
router.get("/service-time-get-all",getAllTimesServer);

const {deleteTimeServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-TIME/rc-admin-service-time-delete");
router.delete("/service-time-delete-specific/:id",deleteTimeServer);

const {getServiceNameServer,getServiceCodeServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-get-service-specific-details");
router.get("/service-name/:id",getServiceNameServer);
router.get("/service-code/:id",getServiceCodeServer);


const {updateTimeServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-TIME/rc-admin-service-time-update")
router.put("/service-time-update/:id",updateTimeServer);


const {createCustomerRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-PRICE/rc-admin-service-price-create");
router.post("/service-price-create",createCustomerRateServer);

const {deleteCustomerRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-PRICE/rc-admin-service-price-delete");
router.delete("/service-price-delete/:id", deleteCustomerRateServer)


const {getAllCustomerRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-PRICE/rc-admin-service-price-get-all");
router.get("/service-price-get-all",getAllCustomerRateServer);

const {getSpecificCustomerRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-PRICE/rc-admin-service-price-get-specific");
router.get("/service-price-get-specific/:id",getSpecificCustomerRateServer);


const {updateCustomerRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE-PRICE/rc-admin-service-price-update");
router.put("/service-price-update/:id",updateCustomerRateServer);



// Exporting the app routes for using this in our main routes folder
module.exports = router;