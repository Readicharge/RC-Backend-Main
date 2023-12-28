
const express = require('express');
const router = express.Router();



const {hold_payment_for_subscription} = require("../../RC-PAYMENT-OPERATIONS/RC-INSTALLER/RC-SUBSCRIPTION-PAYMENTS/rc-hold-subscription-amount");
const { 
    addBankAccount,
    updateBankAccount,
    deleteBankAccount
    } = require("../../RC-PAYMENT-OPERATIONS/RC-INSTALLER/RC-ACCOUNT-MAKER/rc-account-maker");

router.post("/installerPayment1/:installerId", hold_payment_for_subscription);
router.post("/installerPayment2/:installerId", addBankAccount);
router.put("/installerPayment3/:installerId", updateBankAccount);
router.delete("/installerPayment4/:installerId", deleteBankAccount);




module.exports = router;