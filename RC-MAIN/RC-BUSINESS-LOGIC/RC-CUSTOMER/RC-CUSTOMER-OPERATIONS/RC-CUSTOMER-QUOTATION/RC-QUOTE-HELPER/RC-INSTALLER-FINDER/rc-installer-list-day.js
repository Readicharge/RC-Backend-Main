// This section will find the list of days in the calender month on which any installer is available or not

const Installer = require('../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model');
const Schedule = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");
const Time = require('.././../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model')

// Importing the Booking Model 
const Booking = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-BOOKING/rc-booking-model");

const axios = require('axios');









// *********************************************************************************
// Helper Function to get the coordinates for the given address using OpenStreetMap
// *********************************************************************************




// FUNCTION TO GET THE COORDINATES BASED ON THE ADDRESS FROM THE THIRD PARTY API 
async function getCoordinates(addressLine1, addressLine2, zip, city, state) {
    try {
        const address = `${addressLine1} ${addressLine2} ${city} ${state} ${zip}`;
        const response = await axios.get('http://api.positionstack.com/v1/forward', {
            params: {
                access_key: process.env.GEO_API_KEY,
                query: address,
                limit: 1,
            },
        });
        const { data } = response;
        if (data.data.length === 0) {
            throw new Error('Address not found');
        }
        const location = data.data[0];
        const geo = {
            latitude: location.latitude,
            longitude: location.longitude,
        };
        console.log(geo);
        return geo;
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


// *************************************************************************************************
//               Function for Gettting the installer on for the address and service
// *************************************************************************************************



// Get coordinates for the given address using OpenStreetMap
const installerAvailability_for_Service_and_Location = async (data) => {
    try {
        const { addressLine1, addressLine2, zip, state, city , serviceId , date ,number_of_installs} = data;

        const geo = await getCoordinates(addressLine1, addressLine2, zip, city, state);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;
        let nearestInstaller = [];

        // Finding the installers which are available in that state for the given pair for services
        const installers = await Installer.find({
            state: state,
            services: { $all: serviceId } // Using $all to find installers with all services in the array
          }).exec();

        // Finding those installers which are avaiable under the area of the customer address
        installers.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);
            // finding the distance between the installer address and the user address and if the distance is under the working 
            // area of the installer then the installer is added to the list for further evaluation 
            console.log(userLatitude);
            console.log(userLongitude);
            console.log("________________________________");
            console.log(installer.latitude);
            console.log(installer.longitude);
            if (distance <= installer.miles_distance) {
                nearestInstaller.push({
                    installer: installer,
                    distance: distance
                });

            }
        });

        // Finding those installers from this list which are available on that given date 

        // Check Case 1 : Installer Not Booked on that day 
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


        // Check Case 2 : Installer schedule present on that date : Both Weekly and Daily
        const day = new Date(date).toLocaleString('default', { weekday: 'long' });
        const freeInstallers = []
        for (const installer of availableInstallers) {
            // Finding that the particular Installer is  having a recurring schedule on the day
            const schedules = await Schedule.find({ installerId: installer._id, day: day });
            // Finding that the particular Installer is having the Availability on that day or not 
            const availableInstallers_onSpecific_Date = await Availability.find({ installer_id: installer._id, date: date });
            const getServicecompletionTime = await Time.find({
                service_id: { $in: serviceId }, 
                number_of_installs: number_of_installs
              }).exec();

            console.log(getServicecompletionTime);
              
            
            

            if (getServicecompletionTime.length === 0) console.log("error here")
            else {
                // If none of the thing is mentioned 
                if (getServicecompletionTime.length > 0 && availableInstallers_onSpecific_Date.length === 0 && schedules.length === 0) freeInstallers.push({ installer: installer, weekly_schedule: schedules, monthly_schedule: availableInstallers_onSpecific_Date });
                else {

                    const InstallerTimeWindow_onDate = (schedules.length === 0) ? getServicecompletionTime[0].time_min : (schedules[0].endTime - schedules[0].startTime);
                    const availInstaller_specificDate_timeDiff = (availableInstallers_onSpecific_Date.length === 0) ? getServicecompletionTime[0].time_min : (availableInstallers_onSpecific_Date[0].time_end - availableInstallers_onSpecific_Date[0].time_start);

                    console.log(`The time is ${getServicecompletionTime[0]}`)
                    if (getServicecompletionTime[0].time_min <= InstallerTimeWindow_onDate && (availInstaller_specificDate_timeDiff <= InstallerTimeWindow_onDate)) {
                        freeInstallers.push({ installer: installer, weekly_schedule: schedules, monthly_schedule: availableInstallers_onSpecific_Date });
                    }
                }
            }
        }
        
        if (freeInstallers.length > 0) {
            // res.status(200).json({ status: true });
            return {
                status: true,
                data: freeInstallers
            }
        }
        else {
            // res.status(200).json({ status: false });
            return {
                status: false,
                data: freeInstallers
            }
        }
    }
    catch (error) {
        console.log(error);
        // res.status(500).json(error)
        return {
            status:false,
            data:null
        }
    }

}


module.exports = { 
    installerAvailability_for_Service_and_Location
}




















