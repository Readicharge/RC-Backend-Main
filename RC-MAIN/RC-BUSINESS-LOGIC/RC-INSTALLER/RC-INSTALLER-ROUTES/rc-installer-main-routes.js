
const express = require('express');
const router = express.Router();



// ********************************************************************************************************************************
//                                               MODULE 1 : INSTALLER ONBOARDING
// ********************************************************************************************************************************

const {getPriceByState} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-HELPER-MAIN/getPriceByState");
router.get("/getPriceBYState",getPriceByState);


const {Register_the_Installer} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-register-main");
router.post("/register",Register_the_Installer);


const {Update_Registration_User} = require("../RC-INSTALLER-OPERATIONS/RC-INSTALLER-REGISTER-MAIN/rc-installer-update-register-main");
router.put("/update/:installerId",Update_Registration_User);

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




// Exporting the app routes for using this in our main routes folder
module.exports = router;