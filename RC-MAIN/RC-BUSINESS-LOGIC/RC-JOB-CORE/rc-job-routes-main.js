
const express = require('express');
const router = express.Router();




const {rc_job_creater,rc_job_Installer_confirmator} = require("./rc-job-core");
router.post("/create-new",rc_job_creater);
router.post("/update-job-to-confirm-installer",rc_job_Installer_confirmator)











module.exports = router;