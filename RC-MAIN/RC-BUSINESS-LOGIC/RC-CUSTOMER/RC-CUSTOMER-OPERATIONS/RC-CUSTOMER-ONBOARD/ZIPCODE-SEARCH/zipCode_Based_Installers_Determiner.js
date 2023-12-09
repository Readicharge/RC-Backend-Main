const axios = require("axios");

// Imporitng the Installer Model , as we need to find the installers which are nearby available  by the zip code 
const Installer = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model");

// FUNCTION TO GET THE COORDINATES BASED ON THE ADDRESS FROM THE THIRD PARTY API 
async function getCoordinates(zip) {
    try {
        const address = `${zip}`;
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



// ******************************************************************************************
//                                      CUSTOMER-API-01
// ******************************************************************************************




const zipCode_based_search = async (req,res) => {   
    const {zipCode} = req.body;
    const coordinates = await getCoordinates(zipCode);
    console.log(coordinates);
    const installers = await Installer.find({zipCode:zipCode});
    const installer_list = [];
    for(let i=0;i<installers.length;i++){
        const distance = getDistance(coordinates.latitude,coordinates.longitude,installers[i].latitude,installers[i].longitude);
        if(distance<4000){
            installer_list.push(installers[i]);
        }
    }
    if(installer_list.length>0){
        res.json({
            success:true,
            installer_list:installer_list.length
        })
    }
    else
    {
        res.json({
            success:false,
            message:"No Installers found nearby"
        })
    }
}


module.exports = {
    zipCode_based_search
}