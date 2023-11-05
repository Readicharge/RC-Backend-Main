
const express = require('express');
const router = express.Router();



// ********************************************************************************************************************************
//                                               MODULE 1 : INSTALLER ONBOARDING
// ********************************************************************************************************************************

const {getPriceByState} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getPriceByState");
router.put("/getPriceBYState",getPriceByState);


const {Register_the_Installer} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-register-main");
router.post("/register",Register_the_Installer);


const {Update_Registration_User} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-update-register-main");
router.put("/update/:installerId",Update_Registration_User);


const {getSpecificInstaller} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getInstallerById");
router.get("/get-installer-by-id/:installerId",getSpecificInstaller);

// ********************************************************************************************************************************
//                                               MODULE 2 : INSTALLER SCHEDULE
// ********************************************************************************************************************************


const availabilityController = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-SCHEDULE-MAIN/rc-installer-daily-schedule");
router.put("/update-daily-schedule/:installerId",availabilityController.updateAvailability);
router.get("/get-daily-schedule/:installerId",availabilityController.getAvailabilityByInstallerId);


const scheduleController = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-SCHEDULE-MAIN/rc-installer-weekly-schedule");
router.get("/getScheduleForInstaller/:installerId",scheduleController.getScheduleForInstaller);
router.post('/schedules', scheduleController.createOrUpdateSchedule);
router.get('/inactive-dates/:installerId', scheduleController.getInactiveDates);



// ********************************************************************************************************************************
//                                               MODULE 3 : INSTALLER DIRECT CALLS
// ********************************************************************************************************************************

const {getInstallers,getInstallerById} = require("../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller");
router.get("/getInstallersList",getInstallers);
router.get("/getSpecificIsntaller/:id",getInstallerById);


const {getServiceSpecific} = require("../../RC-ADMIN/RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-get-service-specific-details");
router.get("/getServiceSpecific/:id",getServiceSpecific);



const {getTimePerInstaller} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getTimePerInstaller");
router.get("/getTimePerInstaller/:id",getTimePerInstaller);




// Exporting the app routes for using this in our main routes folder
module.exports = router;