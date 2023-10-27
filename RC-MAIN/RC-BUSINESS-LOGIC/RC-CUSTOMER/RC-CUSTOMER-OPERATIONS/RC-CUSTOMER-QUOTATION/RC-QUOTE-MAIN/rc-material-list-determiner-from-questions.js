// Importing the Mateial Model 
const Material = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-MATERIAL/rc-material-model");
const { material_cost_determinatoin_from_questions } = require("../RC-QUOTE-HELPER/RC-MATERIAL-DETERMINER/rc-material-determiner");
const { service_determiner } = require("../RC-QUOTE-HELPER/RC-SERVICE-DETERMINER/rc-service-determiner");

const get_material_list = async (req, res) => {

    // Getting the Question List 
    const { question_list, number_of_installs, state } = req.body;





    const determined_service = [];
    for (let i = 0; i < number_of_installs; i++) {
        const service = await service_determiner(question_list[i]);
        determined_service.push(service);
    }

    console.log(determined_service);



    const determined_materials_per_service = [];

    for (let i = 0; i < determined_service.length; i++) {
        const determined_service_code = determined_service[i].service_code;
        console.log(determined_service_code);
        const material_list = await material_cost_determinatoin_from_questions({question_list: question_list[i], service_code: determined_service_code, number_of_installs:1, state });
        determined_materials_per_service.push(material_list);
    }

    console.log(determined_materials_per_service);

    res.status(200).json(determined_materials_per_service)



}


module.exports = {
    get_material_list
}