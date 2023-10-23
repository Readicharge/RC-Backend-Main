// Importing the core module 
const {getAllMaterials} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-MATERIAL/rc-material-controller");


const getAllMaterialsServer = async (req,res) =>
{
   const data = req.body;
   const response_from_core = await getAllMaterials(data);
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
    getAllMaterialsServer
}