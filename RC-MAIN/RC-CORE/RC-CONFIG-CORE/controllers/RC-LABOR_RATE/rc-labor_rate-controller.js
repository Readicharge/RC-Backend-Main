const LabourRates = require("../../models/RC-LABOR_RATE/rc-labor_rate-model")

 const getAllLabourRates = async () => {
  try {
    const labourRates = await LabourRates.find();
    // res.status(200).json(labourRates);
    return {
      status: 200,
      data: labourRates
    }
  } catch (err) {
    // res.status(500).json({ message: err.message });
    return {
      status: 500,
      data: "Not able to get all labour rates"
    }
  }
};

const getLabourRateById = async (id) => {
    try {
      const labourRate = await LabourRates.findById(id);
      if (labourRate == null) {
        // return res.status(404).json({ message: 'Labour rate not found' });
        return {
          status: 404,
          data: "Labour rate not found"
        }
      }
      // res.status(200).json(labourRate);
      return {
        status:200,
        data:labourRate
      }
    } catch (err) {
      // res.status(500).json({ message: err.message });
      return {
        status: 500,
        data: "Not able to get labour rate"
      }
    }
  };


  const createLabourRate = async (data) => {
    const labourRate = new LabourRates({
      service_id: data.service_id,
      number_of_installs: data.number_of_installs,
      price_statewise: data.price_statewise
    });
  
    try {
      await labourRate.save();
      // res.status(201).json(newLabourRate);
      return {
        status: 201,
        data: "New Labour Rate Created"
      }
    } catch (err) {
      // res.status(400).json({ message: err.message });
      return {
        status : 400,
        data: "Not able to create new Labour Rate"
    }
    }
  };


  const updateLabourRateById = async (id) => {
    try {
      const labourRate = await LabourRates.findById(id);
      if (labourRate == null) {
        // return res.status(404).json({ message: 'Labour rate not found' });
        return {
          status: 404,
          data: "Labour rate not found"
        }
      }
      if (req.body.service_id != null) {
        labourRate.service_id = req.body.service_id;
      }
      if (req.body.number_of_installs != null) {
        labourRate.number_of_installs = req.body.number_of_installs;
      }
      if (req.body.price_statewise != null) {
        labourRate.price_statewise = req.body.price_statewise;
      }
      const updatedLabourRate = await labourRate.save();
      // res.status(200).json(updatedLabourRate);
      return {
        status: 200,
        data: "Labour Rate Updated"
      }
    } catch (err) {
      // res.status(400).json({ message: err.message });
      return {
        status:500,
        data: "Not able to update labour rate"
      }
    }
  };

  const deleteLabourRateById = async (id) => {
    try {
      const labourRate = await LabourRates.findByIdAndDelete(id);
      if (labourRate == null) {
        // return res.status(404).json({ message: 'Labour rate not found' });
        return {
          status: 404,
          data: "Labour rate not found"
        }
      }
    
      // res.status(200).json({ message: 'Labour rate deleted' });
      return {
        status: 200,
        data: "Labour rate deleted"
      }
    } catch (err) {
      // res.status(500).json({ message: err.message });
      return {
        status: 500,
        data: "Not able to delete labour rate"
      }
    }
  };



  const geLabourRateByServiceId = async(serviceId) =>{
    try {
      // const serviceId = req.params.serviceId;
      const labourRates = await LabourRates.find({ service_id: serviceId });
      // res.json(labourRates);
      return {
        status:200,
        data:labourRates
      }
    } catch (error) {
      // res.status(500).json({ message: error.message });
      return {
        status: 500,
        data: "Not able to get labour rates"
      }
    
    }
  }




 module.exports = { getAllLabourRates , getLabourRateById , createLabourRate , updateLabourRateById ,deleteLabourRateById,geLabourRateByServiceId};