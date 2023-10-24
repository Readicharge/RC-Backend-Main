
// Importing the core module 
const {getServices} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-SERVICE/rc-service-controller");


const getServiceListServer = async (req,res) =>
{
   const data = req.body;
   const response_from_core = await getServices(data);
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
    getServiceListServer
}