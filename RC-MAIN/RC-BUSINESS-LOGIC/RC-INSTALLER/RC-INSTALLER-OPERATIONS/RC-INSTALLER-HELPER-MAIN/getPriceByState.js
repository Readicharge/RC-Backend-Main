const LabourRates = require('../../../../RC-CORE/RC-CONFIG-CORE/models/RC-LABOR_RATE/rc-labor_rate-model');
const Services = require('../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model');

async function getPriceByState(req, res) {
  
  const labourRates = await LabourRates.find();

  try {
    
    const price = labourRates[0].price_statewise
    const selectedServiceId = labourRates[0].service_id;
    const selectedService = await Services.findById(selectedServiceId);
    const serviceName = selectedService.name
    return res.status(200).json({price,serviceName});
  } catch (error) {
   return res.json(error)
  } 

}

module.exports = {
  getPriceByState
};