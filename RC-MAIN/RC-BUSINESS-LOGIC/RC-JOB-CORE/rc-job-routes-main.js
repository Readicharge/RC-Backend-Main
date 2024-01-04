
const express = require('express');
const router = express.Router();




const { 
    rc_job_creater,
    rc_job_Installer_confirmator,
    get_job_By_customerId,
    get_specfic_job_id,
    cancelJobByInstaller,
    cancelJobByCustomer,
    customer_marked_pending_complete,
    customer_marked_complete_complete,
    rc_job_updater,
    cancelJobModified,
    installer_marked_pending_complete,
    get_installer_specific_jobs,
    installer_customer_marked_modified
} = require("./rc-job-core");


router.post("/create-new", rc_job_creater);
router.post("/update-job-to-confirm-installer", rc_job_Installer_confirmator);
router.post("/get-job-by-customerId", get_job_By_customerId);
router.post("/get-specfic-job-id", get_specfic_job_id);
router.put('/c-j-m/:id', cancelJobModified)      // c-j-c ~ Cancel Job by Modified Scope
router.put('/c-i-j/:id', cancelJobByInstaller)  // c-i-j ~ Cancel Job by Installer
router.put('/c-c-j/:id', cancelJobByCustomer);       // c-c-j ~ Cancel Job by Customer
router.put('/c-j-p-c/:id', customer_marked_pending_complete)
router.put('/c-j-c-c/:id', customer_marked_complete_complete);
router.put('/update-existing/:id',rc_job_updater);
router.put('/m-p-j/:id', installer_marked_pending_complete);
router.put('/job-modified',installer_customer_marked_modified);

// Installer Spcific routes 
router.post('/get-jobs-installer',get_installer_specific_jobs);







module.exports = router;