// controllers/serviceController.js
const Service = require('../../models/RC-SERVICE/rc-service-model');

// Create a new service
const createService = async (data) => {
  try {
    // const { name, description,service_code, yearsOfExperience,notes } = req.body;
    const { name, description, service_code, yearsOfExperience, notes } = data;

    const newService = new Service({
      name,
      description,
      service_code,
      notes,
      yearsOfExperience
    });
    await newService.save();
    // res.status(201).json(newService);
    return {
      status: 200,
      data: "New Service Created"
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status: 400,
      data: err.message
    }
  }
};



 // Delete a service by id
const deleteService = async (data) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    // res.sendStatus(204);
    return { 
      status: 204,
      data: "Service Deleted"
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status: 400,
      data: err.message
    }
  }
};



// Update a service by id
const updateService = async (data) => {
  try {
    const { name, description,  certification, yearsOfExperience, notes } = data;
    await Service.findByIdAndUpdate(req.params.id, {
      name,
      description,
      certification,
      notes,
      yearsOfExperience
    }, { new: true });

    // res.status(200).json(service);
    return {
      status: 200,
      data: "Service Updated"
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status: 400,
      data: err.message
    }
  }
};


 // Get a list of all services
const getServices = async () => {
  try {
    const services = await Service.find();
    // res.status(200).json(services);
    return {
      status: 200,
      data: services
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status: 400,
      data: err.message
    }
  }
};



 // Get a specific service by id
const getServiceById = async (serviceId) => {
  try {
    const service = await Service.findById(serviceId);
    // res.status(200).json(service);
    return {
      status : 200, 
      data : service
    }
  } catch (err) {
    // res.status(400).json({ error: err.message });
    return {
      status : 500,
      data : "Not able to get the specific Service"
    }
  }
};


 module.exports = {createService,deleteService,updateService,getServiceById,getServices};