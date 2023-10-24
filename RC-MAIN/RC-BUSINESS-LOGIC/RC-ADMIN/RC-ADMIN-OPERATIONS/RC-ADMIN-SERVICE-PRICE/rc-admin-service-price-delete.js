const {deleteCustomerRate} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-CUSTOMER-RATE/rc-customer_rate-controller");


const deleteCustomerRateServer = async (req,res) =>
{
   const data = req.params.id;
   const response_from_core = await deleteCustomerRate(data);
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
    deleteCustomerRateServer
}