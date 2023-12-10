
const express = require('express');
const router = express.Router();




const { 
    rc_job_creater,
    rc_job_Installer_confirmator,
    get_job_By_customerId,
    get_specfic_job_id,
    cancelJobByInstaller,
    cancelJobByCustomer,
    customer_marked_pending_complete
} = require("./rc-job-core");


router.post("/create-new", rc_job_creater);
router.post("/update-job-to-confirm-installer", rc_job_Installer_confirmator);
router.post("/get-job-by-customerId", get_job_By_customerId);
router.post("/get-specfic-job-id", get_specfic_job_id);
router.put('/c-i-j/:id', cancelJobByInstaller)  // c-i-j ~ Cancel Job by Installer
router.put('/c-c-j/:id', cancelJobByCustomer);       // c-c-j ~ Cancel Job by Customer
router.put('/c-j-p-c/:id', customer_marked_pending_complete)









module.exports = router;