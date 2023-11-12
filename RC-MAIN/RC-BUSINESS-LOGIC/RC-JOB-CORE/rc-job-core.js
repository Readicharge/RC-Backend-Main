const LabourRates = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-LABOR_RATE/rc-labor_rate-model");
const Time = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model");
const Installer = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model");
const Booking = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");
const Installer_Parked = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-PARKED/rc-installer-parked-model");
const Schedule = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");

const axios = require("axios")


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
            customer_id
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

        console.log(installer_daily.length , "Length for the final Installer List");

        // if there is installer present 
        if(installer_daily.length>0) {


        const booking_data = {
            // Getting the address Details 
            addressLine1 : addressDetails.addressLine1,
            addressLine2 : addressDetails.addressLine2,
            city : addressDetails.city,
            state : addressDetails.state,
            zip : addressDetails.zip,

            // Getting the Date and time Details 
            date : date,
            time_start : time_start,
            time_end : time_end,

            // Getting the Price Details 
            price_installer : laborRates.price,
            material_cost : getMaterialList[0].material_cost,
            customerShowingCost:quotation,

            // Getting the Service Details 
            primaryService : primaryService,
            secondaryServiceList : serviceList,

            // Getting the additional Details and the installer details 
            number_of_installs : number_of_installs,
            material_details : getMaterialList[0],
            installer : installer_daily[0],

            // Assigning the end points of the job 
            customer : customer_id
        }


       
        
        const booking = new Booking(booking_data);
        await booking.save();


        console.log(installer_weekly)

        res.status(200).json(
            { odata: booking }
        )
                    
    }
    else 
    {
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


const rc_job_Installer_confirmator = async (req,res)=> {
    try {
        const {booking_id} = req.body;

        const booking = await Booking.findById(booking_id);

        if(!booking)
        {
            res.status(404).json(
                { odata: "No Booking Found" }
            )
        }
        const installer_parked = new Installer_Parked({
            installer_id : booking.installer,
            date : date ,
            installer_parked : true
        });
        await installer_parked.save(installer_parked);
        res.status(200).json({
            odata: "Installer Parked Successfully"
        })

    }
    catch (error) {
        res.status(500).json({
            odata:"Unable to Proceed further , Please Try Again"
        })
    }
}



module.exports = {
    rc_job_creater,
    rc_job_Installer_confirmator
}




// *********************************************************************************
// Helper Function to get the coordinates for the given address using OpenStreetMap
// *********************************************************************************




// FUNCTION TO GET THE COORDINATES BASED ON THE ADDRESS FROM THE THIRD PARTY API 
async function getCoordinates(addressLine1, addressLine2, zip, city, state) {
    try {
        const encodedAddressLine1 = encodeURIComponent(addressLine1);
        const encodedAddressLine2 = encodeURIComponent(addressLine2);
        const encodedCity = encodeURIComponent(city);
        const encodedState = encodeURIComponent(state);
        const encodedZip = encodeURIComponent(zip);
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?street=${encodedAddressLine1}&city=${encodedCity}&state=${encodedState}&postalcode=${encodedZip}&format=json`);
        const { data } = response;
        console.log(response)
        return {
            latitude: data[0]?.lat,
            longitude: data[0]?.lon
        }
    } catch (error) {
        console.log(error);
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