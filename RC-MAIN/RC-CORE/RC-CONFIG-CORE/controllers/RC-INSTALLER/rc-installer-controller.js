require('dotenv').config();
const axios = require('axios');
const Installer = require('../../models/RC-INSTALLER/rc-installer-model');


const { findMostRecentInstaller } = require('../../../RC-UNIQUE_ID-CORE/installer/installeridGenerator');



// This function is used to calculate the installer location ( latitude and longitude ) based out of the address
// This will take the addressLine1 , state and the zip 

async function getCoordinates(addressLine1, addressLine2, city, zip, state) {
  try {
    const address = `${addressLine1} ${city} ${state} ${zip}`;
    const response = await axios.get('http://api.positionstack.com/v1/forward', {
      params: {
        access_key: process.env.GEO_API_KEY,
        query: address,
        limit: 1,
      },
      timeout: 25000, // Set a reasonable timeout value in milliseconds (e.g., 5000ms = 5 seconds)
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

    return geo;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Request was canceled (due to timeout)
      console.error('API request timed out:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.response) {
      // The server responded with an error status (e.g., 4xx or 5xx)
      console.error('API Error:', error.response.data);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.code === 'ECONNABORTED') {
      // Request timed out
      console.error('API request timed out:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.code === 'ENOTFOUND') {
      // Server not found (domain name not resolved)
      console.error('Server not found:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from the server:', error.request);
      return {
        latitude: 0,
        longitude: 0,
      };
    } else {
      // Other unknown errors
      console.error('Error getting coordinates:', error.message);
      return {
        latitude: 0,
        longitude: 0,
      };
    }
  }
}



// Create a new installer
const createInstaller = async (data) => {
  try {
    const { addressLine1, addressLine2, state, zip, city, ...rest } = data;
    const last_sequence_number = await findMostRecentInstaller();
    const current_sequence_number = last_sequence_number + 1;
    const readicharge_unique_id = `RC-I-US-${current_sequence_number}`;

    const { latitude, longitude } = await getCoordinates(addressLine1, addressLine2, city, zip, state);
    console.log(latitude, longitude);


    const installer = await Installer.create({
      ...rest, readicharge_unique_id, sequence_number: current_sequence_number, addressLine1, addressLine2, state, zip, city, latitude, longitude
    });
    console.log(installer)
    // res.status(201).json(installer);
    return {
      status: 200,
      data: installer
    }
  } catch (err) {
    // res.status(400).json({ error: err });
    return {
      status: 500,
      data: "Not able to create the Installer"
    }
  }
};

// ********************************************************************************************************


// Delete an installer by id
const deleteInstaller = async (installerId) => {
  try {
    await Installer.findByIdAndDelete(installerId);
    return {
      status: 204,
      odata: "Installer Deleted Successfully !!"
    }
  } catch (err) {
    return {
      status: 500,
      odata: "Not able to delete the Installer"
    }
  }
};

//   Update the installer by id
const updateInstaller = async (data, installerId) => {
  try {
    const { addressLine1, addressLine2, state, zip, city, ...rest } = data;

    // Get the current installer object
    const currentInstaller = await Installer.findById(installerId);

    // If the address fields are provided, get the updated latitude and longitude
    let latitude = currentInstaller.latitude;
    let longitude = currentInstaller.longitude;
    if (addressLine1 || addressLine2 || zip || state) {
      const coordinates = await getCoordinates(
        addressLine1 || currentInstaller.addressLine1,
        zip || currentInstaller.zip,
        state || currentInstaller.state
      );
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }

    // Update the installer with the new values
    const updatedInstaller = await Installer.findByIdAndUpdate(
      installerId,
      { ...rest, addressLine1, addressLine2, state, zip, city, latitude, longitude },
      { new: true }
    );

    // res.status(200).json(updatedInstaller);
    return {
      status: 200,
      data: "Installer Successfully Updated"
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status: 500,
      data: "Installer Not Upadated :/"
    }
  }
};



// Get a list of all installers
const getInstallers = async () => {
  try {
    const installers = await Installer.find();
    return {
      status: 200,
      odata: installers
    }
  } catch (err) {
    return {
      status: 500,
      odata: "Not able to get the Installers"
    }
  }
};

// Get installer by Id
const getInstallerById = async (installerId) => {
  try {
    const installers = await Installer.findById(installerId);
    return installers;
  } catch (err) {
    return err;
  }
};




module.exports = {
  createInstaller,
  deleteInstaller,
  updateInstaller,
  getInstallers,
  getInstallerById
}


