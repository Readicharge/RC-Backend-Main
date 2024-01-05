const LabourRates = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-LABOR_RATE/rc-labor_rate-model");
const Time = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model");
const Installer = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model");
const Booking = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const Installer_Parked = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-PARKED/rc-installer-parked-model");
const Schedule = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");
const { transfer_payment } = require("../RC-PAYMENT-CORE/RC-PAYMENT-OPERATIONS/RC-INSTALLER/RC-BOOKING-PAYMENTS/rc-payment-release");

const axios = require("axios");
const moment = require("moment");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { get_material_list } = require("../RC-CUSTOMER/RC-CUSTOMER-OPERATIONS/RC-CUSTOMER-QUOTATION/RC-QUOTE-MAIN/rc-material-list-determiner-from-questions");


const rc_job_creater = async (req, res) => {
    try {

        // Step 1 : Get all the inputs which are required from the request
        const {
            quotation, // This is the quotation which we have received for the job
            addressDetails, // The object which contains the address for the location of the job
            primaryService, // This is used to Determine the rate for the installer and the mateial
            serviceList, // This is used to setermine the material List for the installer
            time_start, // This is reterived from the slot section 
            date, // This is reterived from the calender section 
            chargerDetails, // This we will get from the charger details stored earlier
            number_of_installs,
            customer_id,
            houseBuilt,
            isOwner,
            upgradeToNema,
            vehicle_details
        } = req.body;

        // #############################################################################################3

        // Things which we have to reterive/derive additionally
        // 1. Time end : This will be derived from the formulae :
        // time_start + <Time duration : time(Service(id),number_of_installs).time_end - time(Service(id),number_of_installs).time_start )
        // 2. laborRate : derived from Service+number_of_installs 
        // material List : derived from the chargerDetails question_set + number of installs 
        // material price : derived from the material list + number of installs 
        // Charger Details from the Charger question set


        // Once we have all these data , we can goto proceed with creating the booking 

        // #############################################################################################3

        // Step 2 : Getting the Time end 

        const time_allowed_for_customerShowing_Servive = await Time.find(
            {
                service_id: primaryService,
                number_of_installs: number_of_installs
            });

        const time_end = parseInt(time_start) + parseInt(time_allowed_for_customerShowing_Servive[0].time_max);


        // Step 3 : Getting the labor rates

        const obj_for_laborRate_for_the_service = await LabourRates.find(
            {
                service_id: primaryService,
                number_of_installs: number_of_installs
            }
        )
        const itest_row = obj_for_laborRate_for_the_service[0].price_statewise;
        // Interate through the entire array to get the desired state price
        const laborRates = itest_row.find((itest_cell) => itest_cell.state === addressDetails.state);


        // Step 4 : Getting the material list and the corresponding material total cost
        const getMaterialList = await get_material_list({ question_list: chargerDetails, determined_service: serviceList, state: addressDetails.state });

        console.log(getMaterialList[0].materials)


        // Step 5 : Getting the Charger Details from the Charger detailed answer 
        // Done Below 

        // #############################################################################################

        // Now , one the data Gathering is completed , We have focus on the following step
        //    6. Finding the Installer for that service + State 
        //    7. Filtering those Installers based on location 
        //    8. Finding that those Installers are not booked
        //    9. Finding that those Installers are not parked 
        //    10. Finding that those Installers are not having any schedule  (Calender + Slot)
        //    11. Finding that those Installers are not having those days edited (Calender + Slot)


        // #############################################################################################


        // Step 6 : Finding the Installer for that service + State 
        const installers_service_state_filter = await Installer.find({
            state: addressDetails.state,
            services: { $in: serviceList } // Using $in to find installers with any of the services in the array
        }).exec();


        // Step 7 : Finding the Installer based on the location (Need Additional Function)
        const geo = await getCoordinates(addressDetails.addressLine1, addressDetails.addressLine2, addressDetails.zip, addressDetails.city, addressDetails.state);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;

        console.log(userLatitude, userLongitude);
        const nearestInstaller = [];
        installers_service_state_filter.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);
            console.log(distance);

            if (distance <= installer.miles_distance) {
                nearestInstaller.push(installer);

            }
        });


        // Step 8 :  Finding that those Installers are not booked
        const availableInstallers = [];
        for (const installer of nearestInstaller) {
            const Booked_Installer_On_Given_Date = await Booking.find({
                installer: installer._id,
                date: date
            });

            if (Booked_Installer_On_Given_Date.length === 0) {

                availableInstallers.push(installer);

            }
        }




        // Step 9 : Finding that these Installers are parked or not
        const notParkedInstallers = [];
        for (const installer of availableInstallers) {
            const Parked_Installer_On_Given_Date = await Installer_Parked.find({
                installer: installer._id,
                date: date,
                installer_parked: true
            });

            if (Parked_Installer_On_Given_Date.length === 0) {

                notParkedInstallers.push(installer);

            }
        }



        // Step 10 : Finding that those Installers are not having any schedule  (Calender + Slot)
        const installer_weekly = [];
        for (const installer of notParkedInstallers) {
            const Is_Weekly_Status_Installer_On_Given_Date = await Schedule.find({
                installer_id: installer._id,
                date: date,
                active: true,
                $or: [
                    {
                        $and: [
                            { startTime: { $gte: time_start } },
                            { endTime: { $lte: time_end } }
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $lte: time_start } },
                            { endTime: { $gte: time_start } }
                        ]
                    },
                    {
                        $and: [
                            { startTime: { $lte: time_end } },
                            { endTime: { $gte: time_end } }
                        ]
                    }
                ]

            });

            if (Is_Weekly_Status_Installer_On_Given_Date.length > 0) {
                installer_weekly.push(installer);
            }

        }


        // Step 12 : Finding that those Installers are not having those days edited (Calender + Slot)
        const installer_daily = [];
        for (const installer of installer_weekly) {
            const availableInstallers_onSpecific_Date = await Availability.find({
                installer_id: installer._id,
                date: date,
                type: "DISABLED",
                $and: [
                    { start_time: { $gte: time_start } },
                    { end_time: { $lte: time_end } }
                ]
            });

            if (availableInstallers_onSpecific_Date.length === 0) {
                installer_daily.push(installer);
            }

        }

        // Step 13 : Getting all the details

        console.log(installer_daily.length, "Length for the final Installer List");

        // if there is installer present 
        if (installer_daily.length > 0) {


            const booking_data = {
                // Getting the address Details 
                addressLine1: addressDetails.addressLine1,
                addressLine2: addressDetails.addressLine2,
                city: addressDetails.city,
                state: addressDetails.state,
                zip: addressDetails.zip,

                // Getting the Date and time Details 
                date: date,
                time_start: time_start,
                time_end: time_end,

                // Getting the Price Details 
                price_installer: laborRates.price,
                material_cost: getMaterialList[0].material_cost,
                customerShowingCost: quotation,

                // Getting the Service Details 
                primaryService: primaryService,
                secondaryServiceList: serviceList,

                // Getting the additional Details and the installer details 
                number_of_installs: number_of_installs,
                material_details: getMaterialList[0],
                installer: installer_daily[0],

                // Assigning the end points of the job 
                customer: customer_id,

                // Assigning the Chargers Details 
                chargers: chargerDetails,

                // Assigning the General Details 
                houseBuiltYear: houseBuilt,
                upgradeToNema: upgradeToNema,
                isOwner: isOwner,

                // Assigning the Veichle Details 
                vehicle_details: vehicle_details,

                // Decleration of steps handler for the job 
                completion_steps: {
                    stage_0: {
                        status_installer: false,
                        status_customer: false,
                        rating: 0
                    },
                    stage_1: {
                        status_installer: false,
                        status_customer: false,
                        rating: 0
                    },
                    stage_2: {
                        status_installer: false,
                        status_customer: false,
                        rating: 0
                    },
                    overall_completion: {
                        status_installer: false,
                        status_customer: false,
                        rating: 0
                    }
                },

                // Setting the OverAll Job Status [ enums : LIVE , PENDING , COMPLETED , CANCELLED ]
                job_status: "LIVE",

                // Setting the Job Reschedule Status 
                job_rescheduled: false
            }




            const booking = new Booking(booking_data);
            await booking.save();


            console.log(installer_weekly)

            res.status(200).json(
                { odata: booking }
            )

        }
        else {
            res.status(404).json(
                {
                    odata: "No Installer Found"
                }
            )
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).json(
            { odata: error.message }
        );
    }

}





const rc_job_updater = async (req, res) => {

    try {
        const bookingId = req.params.id;
        // Step 1 : Get all the inputs which are required from the request
        const {
            quotation, // This is the quotation which we have received for the job
            addressDetails, // The object which contains the address for the location of the job
            primaryService, // This is used to Determine the rate for the installer and the mateial
            serviceList, // This is used to setermine the material List for the installer
            chargerDetails, // This we will get from the charger details stored earlier
            number_of_installs,
        } = req.body;

        // Step 2 : Getting the labor Rate for the installer 
        const obj_for_laborRate_for_the_service = await LabourRates.find(
            {
                service_id: primaryService,
                number_of_installs: number_of_installs
            }
        )
        const itest_row = obj_for_laborRate_for_the_service[0].price_statewise;
        // Interate through the entire array to get the desired state price
        const laborRates = itest_row.find((itest_cell) => itest_cell.state === addressDetails.state);


        // Step 3 : Getting the material list and the corresponding material total cost
        const getMaterialList = await get_material_list({ question_list: chargerDetails, determined_service: serviceList, state: addressDetails.state });

        console.log(getMaterialList[0].materials)




        // Step 4 : Getting the Existing booking Id and modify the job scope from here 
        const booking_data = {
            price_installer: laborRates.price,
            material_cost: getMaterialList[0].material_cost,
            customerShowingCost: quotation,

            primaryService: primaryService,
            secondaryServiceList: serviceList,


            number_of_installs: number_of_installs,
            material_details: getMaterialList[0],

            chargers: chargerDetails
        }

        const booking = await Booking.findByIdAndUpdate(bookingId, booking_data, { new: true });

        // Cancel the Last transaction: Payment So that we can get the New Transaction  
        await axios.post(
            `https://rc-backend-main-f9u1.vercel.app/api/payments/customerPayment3`,
            { booking_id: bookingId }
        );


        res.status(200).json(
            { odata: booking }
        )


    }
    catch (error) {
        res.status(500).json(
            { odata: error.message }
        );
    }
}





const rc_job_Installer_confirmator = async (req, res) => {
    try {
        const { booking_id, status } = req.body;

        const booking = await Booking.findById(booking_id);

        if (booking === null || booking === undefined || booking.length === 0) {
            res.status(404).json(
                { odata: "No Booking Found" }
            )
        }
        else {
            const installer_parked_status = await Installer_Parked.findOne({
                installer_id: booking.installer,
                date: booking.date,
                installer_parked: true
            })

            if (installer_parked_status === null || installer_parked_status === undefined || installer_parked_status.length === 0) {
                const installer_parked = new Installer_Parked({
                    installer_id: booking.installer,
                    date: booking.date,
                    installer_parked: status
                });
                await installer_parked.save(installer_parked);
            }
            else {
                installer_parked_status.installer_parked = true;
                await installer_parked_status.save();
            }
            res.status(200).json({
                odata: "Installer Parked Successfully"
            })

        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            odata: "Unable to Proceed further , Please Try Again"
        })
    }
}


const get_job_By_customerId = async (req, res) => {
    try {
        const { customerID } = req.body;

        const booking = await Booking.find({ customer: customerID });
        if (booking === null || booking === undefined || booking.length === 0) {
            res.status(404).json(
                { odata: "No Booking Found" }
            )
        }
        else {
            res.status(200).json(
                { odata: booking }
            )
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            odata: "Unable to Proceed further , Please Try Again"
        });

    }

}


const get_specfic_job_id = async (req, res) => {
    const { bookingId } = req.body;
    try {
        const booking = await Booking.findById(bookingId);
        if (booking === null || booking === undefined || booking.length === 0) {
            res.status(404).json(
                { odata: "No Booking Found" }
            )
        }
        else {
            res.status(200).json(
                { odata: booking }
            )
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            odata: "Unable to Proceed further , Please Try Again"
        });
    }
}


const cancelJobByInstaller = async (req, res) => {
    try {
        // Getting the job Id
        const jobId = req.params.id;

        // Getting the Job and update the job status
        const jobUpdated = await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'CANCELLED' } },
            { new: true } // To return the updated document
        );

        if (!jobUpdated) {
            console.error('Error updating job_status: Job not found');
            return res.status(404).json({
                error: 'Job not found',
            });
        }

        console.log('Updated document:', jobUpdated);

        // Refund the Customer Appropriate amount
        await axios.post(
            `https://rc-backend-main-f9u1.vercel.app/api/payments/customerPayment3`,
            { booking_id: jobId }
        );

        // Make an Impact on the Installer Rating

        // Sending the response
        res.status(200).json({
            odata: 'Job Cancelled Successfully',
        });
    } catch (error) {
        console.error('Error cancelling job:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}



const cancelJobModified = async (req, res) => {
    try {
        // Getting the job Id
        const jobId = req.params.id;

        // Getting the Job and update the job status
        const jobUpdated = await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'CANCELLED' } },
            { new: true } // To return the updated document
        );

        if (!jobUpdated) {
            console.error('Error updating job_status: Job not found');
            return res.status(404).json({
                error: 'Job not found',
            });
        }

        console.log('Updated document:', jobUpdated);

        // Refund the Customer Appropriate amount
        await axios.post(
            `https://rc-backend-main-f9u1.vercel.app/api/payments/customerPayment3`,
            { booking_id: jobId }
        );

        // Make an Impact on the Installer Rating

        // Sending the response
        res.status(200).json({
            odata: 'Job Cancelled Successfully',
        });
    } catch (error) {
        console.error('Error cancelling job:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}


const cancelJobByCustomer = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Booking.findById(jobId);

        // Get the current date and time
        const currentDateTime = moment();
        console.log(job.date)
        console.log(typeof (job.date), typeof (job.time_start))

        const jobDateTime = moment(job.date);


        // Combine the date with the time_start to create a new moment object
        const jobDate = jobDateTime.format('YYYY-MM-DD');

        const jobDateTimeWithTimeStart = moment(`${jobDate} ${job.time_start}`, 'YYYY-MM-DD HH:mm');


        // Calculate the difference in hours
        const timeDifferenceHours = jobDateTimeWithTimeStart.diff(currentDateTime, 'hours');

        console.log('Time Difference in Hours:', timeDifferenceHours);

        let deductionPercentage;

        // Check the time difference and set deduction percentage accordingly
        if (timeDifferenceHours >= 24) {
            // If the date difference is more than or equal to 24 hours or the current time is greater than the booked date time, then 100% is deducted
            deductionPercentage = 100;
        } else if (timeDifferenceHours > 12) {
            deductionPercentage = 4;
        } else if (timeDifferenceHours > 6) {
            deductionPercentage = 40;
        } else if (timeDifferenceHours >= 3) {
            deductionPercentage = 75;
        } else if (timeDifferenceHours >= 0) {
            deductionPercentage = 89;
        } else {
            // Default case, just to be safe
            deductionPercentage = 100;
        }

        // Apply deduction to the amount
        const finalAmount = job.customerShowingCost * (deductionPercentage / 100);

        console.log('Deduction Percentage:', deductionPercentage);
        console.log('Final Amount:', finalAmount);


        // console.log("final amount", finalAmount)

        // // Getting the Job and update the job status
        const jobUpdated = await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'CANCELLED' } },
            { new: true } // To return the updated document
        );

        if (!jobUpdated) {
            console.error('Error updating job_status: Job not found');
            return res.status(404).json({
                error: 'Job not found',
            });
        }

        // console.log('Updated document:', jobUpdated);

        // Refund the Customer Appropriate amount
        await axios.post(
            `https://rc-backend-main-f9u1.vercel.app/api/payments/customerPayment4`,
            { bookingId: jobId, amount_to_be_charged: finalAmount }
        );



        // Sending the response
        res.status(200).json({
            odata: 'Job Cancelled Successfully',
        });
    } catch (error) {
        console.error('Error cancelling job:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}


const customer_marked_pending_complete = async (req, res) => {
    try {

        // Step1 : Getting the Job Id 
        const jobId = req.params.id;


        // Step2 : Getting the installer Id from the Job Id :
        const booking = await Booking.findById(jobId);

        console.log(booking)
        // Step3 : Marking the Job as Completed State : PENDING
        await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'PENDING' } },
            { new: true }
        );

        // Step3 :Releasing the Material allowance to the Installer 

        await transfer_payment(booking.installer, booking.material_cost);

        // Step4 :Calculation of Rating here is needed

        // Step5 : Return of Response
        res.status(200).json("Successfully Marked as Complete");
    }
    catch (error) {
        res.status(500).json(error)
    }

}

const customer_marked_complete_complete = async (req, res) => {
    try {
        // Step1 : Getting the Job Id
        const jobId = req.params.id;

        // Step2 : Checking The Initial State of the Job Status i.e. LIVE or PENDING
        const booking =await Booking.findById(jobId);
        console.log(booking)
        const booking_initial_status = booking.completion_steps.job_status;

        console.log(booking_initial_status,(parseInt(booking.material_cost) + parseInt(booking.price_installer)))

        // If LIVE, then dispatch all payment else only dispatch the labor rates 
       
        if (booking_initial_status === "LIVE") {
            // Step3 :Releasing the Material + Labor allowance to the Installer 
            const price=((parseInt(booking.material_cost) + parseInt(booking.price_installer)))
            const response = await transfer_payment(booking.installer,price );

            if (response !== null) {
                // Step4 : Marking the Job as Completed State
                await Booking.findByIdAndUpdate(
                    { _id: jobId },
                    { $set: { 'completion_steps.job_status': 'COMPLETE' } },
                    { new: true } // To return the updated document
                );
                // Returning the Response 
                res.status(200).json("Successfully Marked as Complete");
            }
            else {
                res.status(500).json("Error in Payment");
            }
        }
        else {
            console.log("else statement")
            // Step3 :Releasing the Material allowance to the Installer 
            const response = await transfer_payment(booking.installer, parseInt(booking.price_installer));
            if (response !== null) {
                // Step4 : Marking the Job as Completed State
                await Booking.findByIdAndUpdate(
                    { _id: jobId },
                    { $set: { 'completion_steps.job_status': 'COMPLETE' } },
                    { new: true } // To return the updated document
                );
                // Returning the Response 
                res.status(200).json("Successfully Marked as Complete");
            }
            else {
                res.status(500).json("Error in Payment");
            }
        }


        // Step5 : Rating Section Goes here


    }
    catch (error) {
        res.status(500).json(error)
    }

}



const installer_customer_marked_modified = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { idata } = req.body;

        // Step2 : Marking the Job as Completed State
        await Booking.findByIdAndUpdate(
            { _id: bookingId },
            { $set: { 'completion_steps.job_status': idata } },
            { new: true } // To return the updated document
        );
        // Returning the Response 
        res.status(200).json("Successfully Marked as Complete");
    }
    catch (error) {
        res.status(500).json(error)
    }
}



// Installer Perspective *******************************************************************************

const installer_marked_pending_complete = async (req, res) => {
    try {
        // Step 1: Getting the Booking Id
        const jobId = req.params.id;

        // Step2: Marking the Job Stage 2 complete By the Installer
        await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'PENDING-UNAPPROVED' } },
            { new: true } // To return the updated document
        );
    }
    catch (error) {
        res.status(500).json(error)
    }

}


const installer_marked_complete_complete = async (req, res) => {
    try {
        // Step 1: Getting the Booking Id
        const jobId = req.params.id;

        // Step2: Marking the Job Stage 2 complete By the Installer
        await Booking.findByIdAndUpdate(
            { _id: jobId },
            { $set: { 'completion_steps.job_status': 'COMPLETE-UNAPPROVED' } },
            { new: true } // To return the updated document
        );
    }
    catch (error) {
        res.status(500).json(error)
    }

}


const get_installer_specific_jobs = async (req, res) => {
    try {
        const { installerId } = req.body;

        const booking = await Booking.find({ installer: installerId });
        if (booking === null || booking === undefined || booking.length === 0) {
            res.status(404).json(
                { odata: "No Booking Found" }
            )
        }
        else {
            res.status(200).json(
                { odata: booking }
            )
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            odata: "Unable to Proceed further , Please Try Again"
        });

    }
}



module.exports = {
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
    installer_marked_complete_complete,
    get_installer_specific_jobs,
    installer_customer_marked_modified
}




// *********************************************************************************
// Helper Function to get the coordinates for the given address using OpenStreetMap
// *********************************************************************************




// FUNCTION TO GET THE COORDINATES BASED ON THE ADDRESS FROM THE THIRD PARTY API 
async function getCoordinates(addressLine1, addressLine2, zip, city, state) {
    try {
        const apiKey = 'AIzaSyAlr7wiWbiPhgKpWAN7lNSAxgwhujouyc4'; // Replace with your actual API key

        const encodedAddressLine1 = encodeURIComponent(addressLine1);
        const encodedAddressLine2 = encodeURIComponent(addressLine2);
        const encodedCity = encodeURIComponent(city);
        const encodedState = encodeURIComponent(state);
        const encodedZip = encodeURIComponent(zip);

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddressLine1},${encodedAddressLine2},${encodedCity},${encodedState},${encodedZip}&key=${apiKey}`
        );

        const { data } = response;

        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            return {
                latitude: location.lat,
                longitude: location.lng
            };
        } else {
            console.error('Error in geocoding:', data.status);
            throw new Error('Error getting coordinates');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error getting coordinates');
    }
}

// Get the distance between two sets of coordinates using the Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log(distance)
    return distance;
}
// Convert degrees to radian
function toRadians(degrees) {
    const radians = (degrees * Math.PI) / 180;
    return radians;
}