const {getCustomerRateById} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-CUSTOMER-RATE/rc-customer_rate-controller");


const getSpecificCustomerRateServer = async (req,res) =>
{

   const id = req.params.id;
   const response_from_core = await getCustomerRateById(id);
   
   if(response_from_core.status===200)
   {
    res.status(200).json(response_from_core.data)
   }
   else
   {
    res.status(400).json(response_from_core.data);
   }
}


module.exports = {
    getSpecificCustomerRateServer
}