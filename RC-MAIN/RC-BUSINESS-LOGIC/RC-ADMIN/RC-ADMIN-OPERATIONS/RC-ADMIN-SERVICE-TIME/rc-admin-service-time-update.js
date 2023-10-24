const {updateTime} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-TIME/rc-time-controller");


const updateTimeServer = async (req,res) =>
{
   const id = req.params.id;
   const data = req.body;
   console.log(data)
   const response_from_core = await updateTime(id,data);
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
    updateTimeServer
}