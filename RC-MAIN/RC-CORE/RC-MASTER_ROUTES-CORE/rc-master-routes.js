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




app.use('/customerApp',customer_app);
app.use('/admin_web_app',admin_web_app);



module.exports = app;