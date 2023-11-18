
const express = require('express');
const router = express.Router();




const {rc_job_creater,rc_job_Installer_confirmator,get_job_By_customerId} = require("./rc-job-core");
router.post("/create-new",rc_job_creater);
router.post("/update-job-to-confirm-installer",rc_job_Installer_confirmator);
router.post("/get-job-by-customerId",get_job_By_customerId);











module.exports = router;