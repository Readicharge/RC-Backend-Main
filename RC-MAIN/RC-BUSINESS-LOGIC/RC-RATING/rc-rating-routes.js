
const express = require('express');
const router = express.Router();



const { 
    updateStage0Rating,
    updateStage1Rating,
    updateStage2Rating,
    calculateInstallerRating
    } = require("./rc-installer-rating");

router.put("/updateStage0-Rating/:bookingId",updateStage0Rating);
router.put("/updateStage1-Rating/:bookingId",updateStage1Rating);
router.put("/updateStage2-Rating/:bookingId",updateStage2Rating);
router.put("/installerfinal-Rate/:bookingId",calculateInstallerRating);


module.exports = router;
