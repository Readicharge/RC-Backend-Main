const CustomerRates = require('../../models/RC-CUSTOMER-RATE/rc-customer_rate-model');

// Creating the Customer Rates fo rthe Service id 
const createCustomerRate = async (data) => {
  try {
    const { service_id, number_of_installs, price } = data;
    const customerRate = new CustomerRates({
      service_id,
      number_of_installs,
      price
    });
    await customerRate.save();
    // res.status(201).json(customerRate);
    return {
      status: 200,
      data: "Service Price Created Successfully"
    }
  } catch (error) {
    // res.status(400).json({ message: error.message });
    return {
      status: 500,
      data: "Unable to create the service"
    }
  }
};

// Getting all the rates 
const getAllCustomerRates = async () => {
  try {
    const customerRates = await CustomerRates.find();
    // res.json(customerRates);
    return {
      status: 200,
      data: customerRates
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return {
      status: 500,
      data: " Unable to Get the Servie price for the Customer Quote"
    }
  }
};
const getCustomerRateById = async (id) => {
  try {
    const customerRate = await CustomerRates.findById(id);
    if (customerRate == null) {
      // return res.status(404).json({ message: 'Cannot find customer rate' });
      return {
        status: 404,
        data: "unable to find the customer rate"
      }
    }
    // res.json(customerRate);
    return {
      status: 200,
      data: customerRate
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return {
      status: 500,
      data: "Something wrong happen , please try again after sometime"
    }

  }
};



const updateCustomerRate = async (id,data) => {
  try {
    const customerRate = await CustomerRates.findById(id);
    if (customerRate == null) {
      // return res.status(404).json({ message: 'Cannot find customer rate' });
      return {
        status: 404,
        data: "unable to find the customer rate"
      }
    }
    if (data.service_id != null) {
      customerRate.service_id = data.service_id;
    }
    if (data.number_of_installs != null) {
      customerRate.number_of_installs = data.number_of_installs;
    }
    if (data.price != null) {
      customerRate.price = data.price;
    }
    const updatedCustomerRate = await customerRate.save();
    // res.json(updatedCustomerRate);
    return {
      status: 200,
      data: updatedCustomerRate
    }
  } catch (error) {
    // res.status(400).json({ message: error.message });
    return {
      status: 500,
      data: "Something wrong happen , please try again after sometime"
    }
  }
};



const deleteCustomerRate = async (id) => {
  try {
    await CustomerRates.findByIdAndDelete(id);

    // res.json({ message: 'Deleted customer rate' });
    return {
      status : 200,
      data : "Customer Rate deleted Successfully"
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return {
      status: 500,
      data: "Something wrong happen , please try again after sometime"
    }
  }
};

// Getting all the customer rates for the service Id 

const getCustomerRatesByServiceId = async (serviceId) => {
  try {
    // const serviceId = req.params.serviceId;
    const customerRates = await CustomerRates.find({ service_id: serviceId });
    // res.json(customerRates);
    return {
      status : 200,
      data : customerRates
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return {
      status: 500,
      data: "Something wrong happen , please try again after sometime"
    }
  }
};



module.exports = {
  createCustomerRate,
  getAllCustomerRates,
  getCustomerRateById,
  updateCustomerRate,
  deleteCustomerRate,
  getCustomerRatesByServiceId
};