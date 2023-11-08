// Importing the Mateial Model 
const Material = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-MATERIAL/rc-material-model");
const Service  = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model");

const { material_cost_determinatoin_from_questions } = require("../RC-QUOTE-HELPER/RC-MATERIAL-DETERMINER/rc-material-determiner");
const { service_determiner } = require("../RC-QUOTE-HELPER/RC-SERVICE-DETERMINER/rc-service-determiner");

const get_material_list = async (idata) => {

    // Getting the Question List 
    const { determined_service,question_list, state } = idata;


    
    const determined_materials_per_service = [];

    for (let i = 0; i < determined_service.length; i++) {
        const service = await Service.findById(determined_service[i])
        const material_list = await material_cost_determinatoin_from_questions({question_list: question_list[i], service_code: service.service_code, number_of_installs:1, state });
        determined_materials_per_service.push(material_list);
    }

    console.log(determined_materials_per_service);

    return determined_materials_per_service;



}


module.exports = {
    get_material_list
}