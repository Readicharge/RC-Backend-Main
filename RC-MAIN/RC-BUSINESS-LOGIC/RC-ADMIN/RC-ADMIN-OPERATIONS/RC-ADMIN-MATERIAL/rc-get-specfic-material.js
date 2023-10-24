// Importing the core module 
const {getMaterialById} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-MATERIAL/rc-material-controller");


const getSpecficMaterialsServer = async (req,res) =>
{
   const id = req.params.id;
   const response_from_core = await getMaterialById(id);
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
    getSpecficMaterialsServer
}