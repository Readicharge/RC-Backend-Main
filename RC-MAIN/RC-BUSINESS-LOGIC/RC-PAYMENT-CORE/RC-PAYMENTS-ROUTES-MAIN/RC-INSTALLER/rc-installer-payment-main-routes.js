
const express = require('express');
const router = express.Router();



const {hold_payment_for_subscription} = require("../../RC-PAYMENT-OPERATIONS/RC-INSTALLER/RC-SUBSCRIPTION-PAYMENTS/rc-hold-subscription-amount");
router.post("/installerPayment1/:installerId", hold_payment_for_subscription);




module.exports = router;