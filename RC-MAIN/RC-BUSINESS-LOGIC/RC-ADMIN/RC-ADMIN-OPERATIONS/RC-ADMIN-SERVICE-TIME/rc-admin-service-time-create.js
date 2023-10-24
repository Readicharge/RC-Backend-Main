// This function is to create the service , we are only creating the create option and not others, becuase the services are going to determine alot of features in the coming future 
// But as per the current scope the service is only limited to 4 
// These 4 srvices are going to hardcode with many logics 

// Importing the core module 
const {createTime} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-TIME/rc-time-controller");


const createTimeServer = async (req,res) =>
{
   const data = req.body;
   const response_from_core = await createTime(data);
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
    createTimeServer
}