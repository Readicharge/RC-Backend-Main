
// Importing the core module 
const {getServiceById} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-SERVICE/rc-service-controller");


const getServiceNameServer = async (req,res) =>
{
   const data = req.params.id;
   const response_from_core = await getServiceById(data);
//    console.log(response_from_core.data)
   if(response_from_core.status===200)
   {
    res.status(200).json(response_from_core.data.name)
   }
   else
   {
    res.status(400).json(response_from_core.data);
   }
}


const getServiceCodeServer = async (req,res) =>
{
   const data = req.params.id;
   const response_from_core = await getServiceById(data);
   if(response_from_core.status===200)
   {
    res.status(200).json(response_from_core.data.service_code)
   }
   else
   {
    res.status(400).json(response_from_core.data);
   }
}


module.exports = {
    getServiceCodeServer,
    getServiceNameServer
}