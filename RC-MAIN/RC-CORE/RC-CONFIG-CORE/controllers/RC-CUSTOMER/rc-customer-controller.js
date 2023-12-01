// Import and Configure Dotenv
require('dotenv').config();
// Importing Axios 
const axios = require('axios');
// Importing the Customer Model
const Customer = require('../../models/RC-CUSTOMER/rc-customer-model');
// Importing the Unique ID Generator
const { findMostRecentCustomer } = require('../../../RC-UNIQUE_ID-CORE/customer/customerIdGenerator');



async function getCoordinates(addressLine1, city, zip, state) {
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




// Create a new Customer
const createCustomer = async (data) => {
  try {
    const { addressLine1, addressLine2, state, zip, city, ...rest } = data;
    const last_sequence_number = await findMostRecentCustomer();
    const current_sequence_number = last_sequence_number + 1;
    const readicharge_unique_id = `RC-CUST-${current_sequence_number}`;
    const customer = await Customer.create({
      ...rest, readicharge_unique_id,
      sequence_number: current_sequence_number,
      isRegisteration_completed: true,
      isLogged_in: true,
      address_line1: addressLine1,
      address_line2: addressLine2,  
      city: city,
      state: state,
      zip_code: zip,
    });


    console.log(customer)
    return {
      status: 200,
      data: customer
    }
  } catch (err) {
    return {
      status: 400,
      data: err
    }
  }
};




const updateCustomer = async (data, customerId) => {
  try {
    const { addressLine1, addressLine2, state, zip, city, ...rest } = data

    // Get the current installer object
    const currentCustomer = await Customer.findById(customerId);

    console.log(currentCustomer);

    // If the address fields are provided, get the updated latitude and longitude
    let latitude = currentCustomer.latitude;
    let longitude = currentCustomer.longitude;
    if (addressLine1 || addressLine2 || zip || state) {
      const coordinates = await getCoordinates(
        addressLine1 || currentCustomer.address_line1,
        city || currentCustomer.city,
        zip || currentCustomer.zip,
        state || currentCustomer.state
      );
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }

    // Update the customer with the new values
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { ...rest, addressLine1, addressLine2, state, zip, city, latitude, longitude },
      { new: true }
    );
    console.log(updatedCustomer)
    return {
      status: 200,
      data: updatedCustomer
    }
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      data: err
    }
  }
};



const deleteCustomerById = async (customerId) => {
    try {
      const customer = await Customer.findByIdAndDelete(customerId);
      if (!customer) {
        return {
          status : 404,
          odata : "Cusotmer Not Found!"
        }
      }
      return {
        status : 302,
        odata : "Customer Deteled Successfully"
      };
    } catch (error) {
      return {
        status : 500,
        odata : "Error occured while deleting the Customer"
      }
    }
}




module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomerById
}
