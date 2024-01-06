const LabourRates = require('../../../../RC-CORE/RC-CONFIG-CORE/models/RC-LABOR_RATE/rc-labor_rate-model');
const Services = require('../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model');

async function getPriceByState(req, res) {
  try {
    const labourRates = await LabourRates.find({service_id:"65374fe8f735dd38a821bd38"});
    const price = labourRates[0].price_statewise
    const selectedService = await Services.findById("65374fe8f735dd38a821bd38");
    const serviceName = selectedService.name
    console.log(serviceName,price)

    return res.status(200).json({price,serviceName});
  } catch (error) {
   return res.json(error)
  } 

}

module.exports = {
  getPriceByState
};