// This section will find the list of days in the calender month on which any installer is available or not

const Installer = require('../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model');
const Schedule = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-availability-model");
const Availability = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-AVAILABILITY/rc-installer-daily-model");
const Time = require('.././../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-TIME/rc-time-model')


// Importing the Axios Model
const axios = require('axios');
const Installer_Parked = require('../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/RC-INSTALLER-PARKED/rc-installer-parked-model');









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


// *************************************************************************************************
//               Function for Gettting the installer on for the address and service
// *************************************************************************************************



// Get coordinates for the given address using OpenStreetMap
const installerSlots_Availability_for_Service_and_Location_and_date = async (req, res) => {
    try {
        const { addressLine1, addressLine2, zip, state, city, serviceId, date , number_of_installs } = req.body;

        const geo = await getCoordinates(addressLine1, addressLine2, zip, city, state);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;
        let nearestInstaller = [];

        // Finding the installers which are available in that state for the given pair for services
        const installers = await Installer.find({
            state: state,
            services: { $in: serviceId } // Using $in to find installers with any of the services in the array
        }).exec();


        // console.log(installers);

        // Finding those installers which are avaiable under the area of the customer address
        installers.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);
            console.log(distance);
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

        console.log(installers)

        // Finding those installers from this list which are available on that given date 

        // Check Case 1 : Installer Not Booked on that day 
        const availableInstallers = [];
        for (const installer of nearestInstaller) {
            const Booked_Installer_On_Given_Date = await Installer_Parked.find({
                installer_id: installer._id,
                $or: [
                  { installer_parked: true },
                  { installer_booked: true },
                ],
              });

            console.log(Booked_Installer_On_Given_Date);

            if (Booked_Installer_On_Given_Date.length === 0) {
                console.log("Heelo")
                availableInstallers.push(installer);
            }
        }



        // Here we will change the logic for getting the timeslots 

        // Check Case 2 : Installer schedule present on that date : Both Weekly and Daily
        const day = new Date(date).toLocaleString('default', { weekday: 'long' });
        // console.log(day)

        const freeInstallers_timeSlots = { 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0 }; // Initialize slots

        console.log(availableInstallers);

        for (const i of availableInstallers) {
            const installer = i.installer;
            console.log(installer._id)
            // Find recurring schedules for the installer on the specific day
            const schedules = await Schedule.find({ installer_id: installer._id, day: day });
            console.log(schedules)

            // Find availability for the installer on the specific date
            const availableInstallers_onSpecific_Date = await Availability.find({ installer_id: installer._id, date: date ,type:"DISABLED"});

            // If no schedules or availability are found, mark all time slots as available
            if (schedules.length === 0 && availableInstallers_onSpecific_Date.length === 0) {
                console.log("Inside 1")
                for (const timeSlot in freeInstallers_timeSlots) {
                    freeInstallers_timeSlots[timeSlot] = freeInstallers_timeSlots[timeSlot] + 1; 
                } // Mark all slots as available (e.g., 1 indicates available)
            } else {
                console.log("Inside 2")
                // Logic to handle schedules and availability for this installer

                  // Check with the Slots Time that if the Slots are available or not as per the Time per Slot decied by the admin 
                  const time_for_this_service = await Time.find({
                    service_id:serviceId , 
                    number_of_installs:number_of_installs
                });

                console.log("time for this service",time_for_this_service)


                for (const schedule of schedules) {
                    if (schedule.active) {
                        // Extract start and end times from the schedule
                        const scheduleStartTime = schedule.startTime;
                        const scheduleEndTime = schedule.endTime;

                        

                        // Find the corresponding time slots for the schedule
                        console.log("Schedule", scheduleStartTime, scheduleEndTime)

                        //    Check if the start time is inside the Installer Availability 
                        if (scheduleStartTime <= 13) {
                            console.log("Inside IF")
                          
                            // Mark the time slots as Available

                            for (let i = scheduleStartTime; i <= 13; i++) {

                                if(19 - i >= time_for_this_service[0].time_max)
                                {
                                    freeInstallers_timeSlots[i] = freeInstallers_timeSlots[i] + 1;
                                }
                            }
                        }
                    }

                }

                for (const availability of availableInstallers_onSpecific_Date) {
                    if (availability !== undefined && availability !== null && availability.type !== "DISABLED") {
                        // Extract start and end times from the availability
                        const availabilityStartTime = availability.time_start;
                        const availabilityEndTime = availability.time_end;

                        console.log("Day Wise", availabilityStartTime, availabilityEndTime)


                        if (availabilityStartTime <= 13) {

                            // Mark the time slots as Available
                            for (let i = availabilityStartTime; i <= 13; i++) {
                                if(19 - i >= time_for_this_service[0].time_max)
                                {
                                    freeInstallers_timeSlots[i] = freeInstallers_timeSlots[i] + 1;
                                }
                            }
                        }
                    }

                }

            }

        }

        console.log(freeInstallers_timeSlots); 
        res.status(200).json(freeInstallers_timeSlots)


    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
       
    }

}


module.exports = {
    installerSlots_Availability_for_Service_and_Location_and_date
}




















