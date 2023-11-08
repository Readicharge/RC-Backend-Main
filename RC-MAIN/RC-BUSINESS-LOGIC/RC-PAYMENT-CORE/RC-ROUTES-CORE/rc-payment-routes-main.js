
const express = require('express');
const router = express.Router();




const Account_Addition_Controller = require('../rc-user-account-addition');
const Payment_Activator = require("../rc-hold-payment-charge");
const Payment_Completor = require("../rc-hold-payment-charge");
const Transfers_Controller = require("../rc-transfer-payment");
const Payment_Controller = require("../rc-payment-handler");



// Adding the UserEnd Bank Account to the stripe and then to the RC platform ,
//  so that we can pay them in the future for the job

// These are used for the installer 
router.post('/create-bank-account/:installerId', Account_Addition_Controller.addBankAccount);
router.put('/:installerId/bank-account', Account_Addition_Controller.updateBankAccount);
router.delete('/:installerId/bank-account', Account_Addition_Controller.deleteBankAccount);
router.put('/transfer-funds/:userType/:userId', Transfers_Controller.transfer_paymnet); 

// These are used for both customer and installer 
router.put('/hold-payment/:installerId/:payment_initiated_type', Payment_Activator.hold_payment_on_card);
router.put('/complete-hold-transaction/:id/:payment_initiated_type',Payment_Completor.charge_Hold_amount_from_card);
router.post('/refund-hold-payment',Payment_Activator.refund_hold_with_charge);

   
// This is used by the customer only 
router.post('/job-scope-updated',Payment_Activator.update_price_token);


// Get the Payments Per Installer 
router.get('/installer/:installerId',Payment_Controller.getPaymentPerInstaller);


module.exports = router;







