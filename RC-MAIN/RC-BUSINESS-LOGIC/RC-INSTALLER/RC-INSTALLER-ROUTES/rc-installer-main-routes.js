
const express = require('express');
const router = express.Router();



// ********************************************************************************************************************************
//                                               MODULE 1 : INSTALLER ONBOARDING
// ********************************************************************************************************************************

const {getPriceByState} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getPriceByState");
router.put("/getPriceBYState",getPriceByState);


const {Register_the_Installer} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-register-main");
router.post("/register",Register_the_Installer);

const {signIn} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-AUTH/rc-installer-sign-in");
router.post("/validate",signIn);



const {Update_Registration_User} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-update-register-main");
router.put("/update/:installerId",Update_Registration_User);


const {getSpecificInstaller} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getInstallerById");
router.get("/getSpecificIsntaller/:installerId",getSpecificInstaller);

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

const {getInstallers} = require("../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller");
router.get("/getInstallersList",getInstallers);


const {getServiceSpecific} = require("../../RC-ADMIN/RC-ADMIN-OPERATIONS/RC-ADMIN-SERVICE/rc-get-service-specific-details");
router.get("/getServiceSpecific/:id",getServiceSpecific);



const {getTimePerInstaller} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getTimePerInstaller");
router.get("/getTimePerInstaller/:id",getTimePerInstaller);


// Installer Post booking Scenrios 

const {
    handle_I_have_arrived,
    handle_I_have_Started_the_Job,
    handle_Complete_Pending_Job,
    handle_Complete_Complete_job
} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-BOOKING-MAIN/rc-installer-post-booking");


router.put("/handle-Installer-arrived/:bookingId",handle_I_have_arrived);
router.put("/handle-started-job/:bookingId",handle_I_have_Started_the_Job);
router.put("/handle-complete-pending/:bookingId",handle_Complete_Pending_Job);
router.put("/handle-complete-complete/:bookingId",handle_Complete_Complete_job);






// Exporting the app routes for using this in our main routes folder
module.exports = router;