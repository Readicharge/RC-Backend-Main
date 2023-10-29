// This is used to determine the list of installers which are available on the specific date 

// Importing the Module for the Installer Model 
const Installer = require('../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model');


// Imporitng the axios
const axios = require('axios');
const { days_fully_blocked } = require('../RC-QUOTE-HELPER/RC-INSTALLER-FINDER/rc-installer-list-day');



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


// Function to get the number of days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}







// Business Logic 
const get_those_days_which_are_not_fully_available = async (req, res) => {
    try {
        // Get input data from the request body
        const { addressLine1, serviceId, addressLine2, city, state, zip, ...rest } = req.body;

        // Initialize an array to store availability for the next three months
        const availabilityData = [];


        // Get the current date
        const currentDate = new Date().toISOString().slice(0, 10);
        const geo = await getCoordinates(addressLine1, addressLine2, zip, city, state);
        const userLatitude = geo.latitude;
        const userLongitude = geo.longitude;


        // Stage 1 : Filtering the Installers based out of service and state combination
        const installers = await Installer.find({
            state: state,
            services: { $all: serviceId } // Using $in to find installers with all services in the array
        }).exec();

        const nearestInstaller = [];
        console.log(nearestInstaller.length)

        // Finding those installers which are avaiable under the area of the customer address
        installers.forEach((installer) => {
            const distance = getDistance(userLatitude, userLongitude, installer.latitude, installer.longitude);

            if (distance <= installer.miles_distance) {
                nearestInstaller.push({
                    installer: installer,
                    distance: distance
                });

            }
        });

        // userLongitude, userLatitude  , date  , installers



        const days_not_valid = [];
        const response = await days_fully_blocked(nearestInstaller);
        // for (let month = 0; month < 1; month++) {
        //     const year = parseInt(currentDate.slice(0, 4));
        //     const nextMonth = parseInt(currentDate.slice(5, 7)) + month;

        //     for (let day = 1; day <= getDaysInMonth(nextMonth, year); day++) {
        //         // Calculate the date for the current iteration
        //         const date = `${year}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00.000Z`;

        //         const input_response = {
        //             date: date,
        //             installers: nearestInstaller
        //         }

        //         // console.log(input_response)
        //         const response = await avaiable_on_this_date(input_response)

        //         if (response.status === 200) {
        //             days_valid.push(
        //                 {
        //                     status: 1,
        //                     date: date
        //                 }
        //             );
        //         }
        //         else
        //         {
        //             days_valid.push(
        //                 {
        //                     status: 0,
        //                     date: date
        //                 }
        //             )
        //         }

        //     }
        // }

        res.status(200).json(response)

    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    get_those_days_which_are_not_fully_available
}



