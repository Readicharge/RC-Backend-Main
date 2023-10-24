const {getAllTimes} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-TIME/rc-time-controller");


const getAllTimesServer = async (req,res) =>
{
   const data = req.body;
   const response_from_core = await getAllTimes(data);
   if(response_from_core.status===200)
   {
    res.status(200).json(response_from_core.data)
   }
   else
   {
    res.status(500).json(response_from_core.data);
   }
}


module.exports = {
    getAllTimesServer
}