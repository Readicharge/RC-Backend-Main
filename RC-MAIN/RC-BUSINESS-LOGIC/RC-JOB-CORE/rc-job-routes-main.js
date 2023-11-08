
const express = require('express');
const router = express.Router();




const {rc_job_creater} = require("./rc-job-core");
router.post("/create-new",rc_job_creater);











module.exports = router;