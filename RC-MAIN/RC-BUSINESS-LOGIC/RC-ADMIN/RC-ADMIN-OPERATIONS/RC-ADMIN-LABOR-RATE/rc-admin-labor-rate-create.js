const {createLabourRate} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-LABOR_RATE/rc-labor_rate-controller");


const createLaborRateServer = async (req,res) =>
{
   const data = req.body;
   const response_from_core = await createLabourRate(data);
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
    createLaborRateServer
}