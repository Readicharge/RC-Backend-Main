// Importing the core module 
const {updateMaterial} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-MATERIAL/rc-material-controller");


const updateMaterialServer = async (req,res) =>
{
   const data = req.body;
   const id = req.params.id;
   const response_from_core = await updateMaterial(id,data);
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
    updateMaterialServer
}