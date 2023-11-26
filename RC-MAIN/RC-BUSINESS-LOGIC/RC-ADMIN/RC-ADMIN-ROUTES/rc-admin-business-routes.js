
const express = require('express');
const router = express.Router();



// *************************************************************************************************************************************//
//                                              MODULE 1 : SERVICE - ADMIN
// *************************************************************************************************************************************//

const {createServiceServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-create-service");
router.post("/service-create",createServiceServer);

const {createAdminServer,getAdminServer,deleteAdminServer} = require('../RC-ADMIN-OPERATIONS/RC-ADMIN-MANAGE/rc-admin-main');
router.post("/registerAdmin",createAdminServer);
router.post("/getAdmin",getAdminServer);
router.delete("/deleteAdmin/:id",deleteAdminServer)

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


const {getInstallerServer,deleteInstallerServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-INSTALLER/rc-installer-main");
router.get("/installer-get-all",getInstallerServer);
router.delete("/installer-delete/:id",deleteInstallerServer);



const {getCustomerAll} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-CUSTOMER/rc-customer-main");
router.get("/customer-get-all",getCustomerAll);






// *************************************************************************************************************************************//
//                                              MODULE 2 : LABOR RATES - ADMIN
// *************************************************************************************************************************************//


const {createLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-create");
router.post("/labor-rate-create",createLaborRateServer);

const {getAllLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-get-all");
router.get("/labor-rate-get-all",getAllLaborRateServer);

const {deleteLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-delete");
router.delete("/labor-rate-delete/:id",deleteLaborRateServer);

const {getSpecificLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-get-specific");
router.get("/labor-rate-get-specific/:id",getSpecificLaborRateServer);

const {updateLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-update");
router.put("/labor-rate-update/:id",updateLaborRateServer);


const {getServiceLaborRateServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-LABOR-RATE/rc-admin-labor-rate-get-service-id");
router.get("/labor-rate-get-service-id/:id",getServiceLaborRateServer);



// *************************************************************************************************************************************//
//                                              MODULE 3 : MATERIALS - ADMIN
// *************************************************************************************************************************************//


const {createMaterialServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-create-material");
router.post("/material-create",createMaterialServer);


const {getAllMaterialsServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-get-material-list");
router.get("/material-get-all",getAllMaterialsServer);


const {deleteMaterialServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-delete-material");
router.delete("/material-delete/:id",deleteMaterialServer);


const {getSpecficMaterialsServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-get-specfic-material");
router.get("/material-get-specific/:id",getSpecficMaterialsServer);


const {updateMaterialServer} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-update-material");
router.put("/material-update/:id",updateMaterialServer);


const {getMaterialName} = require("../RC-ADMIN-OPERATIONS/RC-ADMIN-MATERIAL/rc-get-material-name");
router.get("/material-get-name/:id",getMaterialName);












// Exporting the app routes for using this in our main routes folder
module.exports = router;