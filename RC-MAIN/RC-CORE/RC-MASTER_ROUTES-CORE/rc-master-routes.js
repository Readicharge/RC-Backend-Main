const express = require("express");

const app = express();





// **********************************************************************************************************
//                                   CORE FUNCITONS LOGIC ROUTES STARTS HERE
// **********************************************************************************************************


// Importing the Routes
// const adminRoutes = require('./admin.routes');
// const serviceRoutes = require('./service.routes');
// const timePerServiceRoutes = require('./timePerService.routes');
// const servicePriceRoutes = require('./servicePrice.routes');
// const materialRoutes = require('./material.routes');
// const LabourRatesRoutes = require('./laborRate.routes');
// const PaymentRoutes  = require('./payment.routes');
// const InstallerRoutes = require("./installer.routes");
// const InstallerWeeklyTimeRoutes = require("./installer_routes/installer_weekly_availability.routes");
// const AvailabilityRoutes = require("./installer_routes/installer_availability.routes");
// const BookingRoutes = require("./booking.routes");
// const RatingRoutes  = require("./rating.routes");
// const ClearCheckRoutes = require("./clearcheck.routes");
const CustomerRoutes = require("../RC-CONFIG-CORE/routes/RC-CUSTOMER/rc-customer-routes");

// Using the Routes
// app.use('/admins', adminRoutes); // done
// app.use('/services',serviceRoutes); // done
// app.use('/time',timePerServiceRoutes); // done
// app.use("/customerRate",servicePriceRoutes); // done
// app.use("/materials",materialRoutes);  // done
// app.use("/LabourRates",LabourRatesRoutes); // done
// app.use("/payments",PaymentRoutes); 
// app.use("/installer",InstallerRoutes);
// app.use("/recurring",InstallerWeeklyTimeRoutes);
// app.use("/availability",AvailabilityRoutes);
// app.use("/booking",BookingRoutes);
// app.use("/rating",RatingRoutes);
// app.use("/clearcheck",ClearCheckRoutes);
app.use("/customer",CustomerRoutes);


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



const customer_app = require('../../RC-BUSINESS-LOGIC/RC-CUSTOMER/RC-CUSTOMER-ROUTES/rc-customer-business-routes')




app.use('/customer_app',customer_app)



module.exports = app;