
const express = require('express');
const router = express.Router();



const {hold_payment_for_job} = require("../../RC-PAYMENT-OPERATIONS/RC-CUSTOMER/RC-JOB/rc-hold-customer-payment");
router.post("/customerPayment1", hold_payment_for_job);



const {charge_payment_for_job} = require("../../RC-PAYMENT-OPERATIONS/RC-CUSTOMER/RC-JOB/rc-charge-customer-payment");
router.post("/customerPayment2", charge_payment_for_job);



const {cancel_payment_for_job} = require("../../RC-PAYMENT-OPERATIONS/RC-CUSTOMER/RC-JOB/rc-cancel-customer-payment");
router.post("/customerPayment3", cancel_payment_for_job);


const {create_customer_refund} = require("../../RC-PAYMENT-OPERATIONS/RC-CUSTOMER/RC-JOB/rc-refund-customer-payment");
router.post("/customerPayment4",create_customer_refund);


// Charging the card and refund the rest of the amount




module.exports = router;