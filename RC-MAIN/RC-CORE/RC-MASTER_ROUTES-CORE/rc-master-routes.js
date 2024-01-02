const express = require("express");

const app = express();





// **********************************************************************************************************
//                                   CORE FUNCITONS LOGIC ROUTES STARTS HERE
// **********************************************************************************************************





// **********************************************************************************************************
//                                  SEEDER FUNCTION DATA STARTS HERE
// **********************************************************************************************************


const seederDataMain = require("../../RC-DATA-SEEDER/main.seeder.routes");



// using the Seeder function with the route
app.use("/seeder",seederDataMain);




// **********************************************************************************************************
//                                   BUSINESS FUNCITONS LOGIC ROUTES STARTS HERE
// **********************************************************************************************************



// **********************************************************************************************************
//                                                      CUSTOMER
// **********************************************************************************************************



const customer_app = require('../../RC-BUSINESS-LOGIC/RC-CUSTOMER/RC-CUSTOMER-ROUTES/rc-customer-business-routes');
const admin_web_app = require("../../RC-BUSINESS-LOGIC/RC-ADMIN/RC-ADMIN-ROUTES/rc-admin-business-routes");
const installer_app = require("../../RC-BUSINESS-LOGIC/RC-INSTALLER/RC-INSTALLER-ROUTES/rc-installer-main-routes");
const job_core = require("../../RC-BUSINESS-LOGIC/RC-JOB-CORE/rc-job-routes-main");
const payment_Customer_Core = require("../../RC-BUSINESS-LOGIC/RC-PAYMENT-CORE/RC-PAYMENTS-ROUTES-MAIN/RC-CUSTOMER/rc-custmer-payment-main-routes");
const payment_Installer_Core = require("../../RC-BUSINESS-LOGIC/RC-PAYMENT-CORE/RC-PAYMENTS-ROUTES-MAIN/RC-INSTALLER/rc-installer-payment-main-routes");
const ratingRoutes = require("../../RC-BUSINESS-LOGIC/RC-RATING/rc-rating-routes");



// Core Business Interfaces API central path: Main
app.use('/customerApp',customer_app);
app.use('/admin_web_app',admin_web_app);
app.use('/installerApp',installer_app);

// Core Business Algorithm API central path : Main
app.use("/jobs",job_core);
app.use("/payments",payment_Customer_Core);
app.use("/payments_installer",payment_Installer_Core);  
app.use("/rating",ratingRoutes);



module.exports = app;