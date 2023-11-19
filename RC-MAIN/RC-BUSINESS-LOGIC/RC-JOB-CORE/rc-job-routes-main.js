
const express = require('express');
const router = express.Router();




const {rc_job_creater,rc_job_Installer_confirmator,get_job_By_customerId,get_specfic_job_id} = require("./rc-job-core");
router.post("/create-new",rc_job_creater);
router.post("/update-job-to-confirm-installer",rc_job_Installer_confirmator);
router.post("/get-job-by-customerId",get_job_By_customerId);
router.post("/get-specfic-job-id",get_specfic_job_id);











module.exports = router;