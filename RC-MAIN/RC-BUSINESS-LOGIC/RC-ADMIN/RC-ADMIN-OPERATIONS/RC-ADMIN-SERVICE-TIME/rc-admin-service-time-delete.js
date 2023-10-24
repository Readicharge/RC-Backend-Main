const {deleteTime} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-TIME/rc-time-controller");


const deleteTimeServer = async (req,res) =>
{
   const data = req.params.id;
   const response_from_core = await deleteTime(data);
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
    deleteTimeServer
}