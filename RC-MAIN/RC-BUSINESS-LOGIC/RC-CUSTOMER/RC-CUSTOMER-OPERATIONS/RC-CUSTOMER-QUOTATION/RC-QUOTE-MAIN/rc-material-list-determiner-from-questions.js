// Importing the Mateial Model 
const Material = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-MATERIAL/rc-material-model");

const get_material_list = async (req,res) => {

// Getting the Question List 
const {question_list} = req.body;

// Taking the all materials from the Material List 
const all_materials = await Material.find({});

console.log(all_materials);


res.status(200).json(all_materials)



}


module.exports = {
    get_material_list
}