// Importing the core module 
const {deleteMaterial} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-MATERIAL/rc-material-controller");


const deleteMaterialServer = async (req,res) =>
{
   const data = req.params.id;
   const response_from_core = await deleteMaterial(data);
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
    deleteMaterialServer
}