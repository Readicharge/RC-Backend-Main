const { service_determiner } = require("../RC-SERVICE-DETERMINER/rc-service-determiner");
const { material_and_additional_price_determiner } = require("./rc-material-price");

const Materials = require("../../../RC-CORE/RC-CONFIG-CORE/models/RC-MATERIAL/rc-material-model");
const Service = require("../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model");

// Sample Question Format 
const question_set = {
    cd2_1:'false',
    cd2_2:'',
    cd2_2a:'',
    cd2_3:'Hardwired',
    cd2_3a:'50A - 12kw',
    cd2_4:'Outside wall of home',
    cd2_5:'',
    cd2_5a:'',
    cd2_5b:'',
    cd2_5c:'',
    cd2_5d:'',
    cd2_5e:'',
    cd2_6:'Brick',
    cd2_6a:'',
    cd2_7:'Brick',
    cd2_8:'Inside my home',
    cd2_8a:'true',
    cd2_8b:'',
    cd2_9:'true',
    cd2_10:'Breaker panel',
    cd2_11:'true',
    cd2_12:'Eaton',
    cd2_13:'125A',
    cd2_13a:'',
    cd2_13b:'',
    cd2_14:'51-75 feet'
}

const material_cost_determinatoin_from_questions = async (req,res) => {

    const {number_of_installs,state} = req.body;
    try {
        const service_id = await service_determiner(question_set);
        const service = await Service.findById(service_id);
        const service_data = {
            id: service_id,
            code: service.service_code
        }
        // Retrieve all materials from the database
        const allMaterials = await Materials.find({});

        // Initialize the object to store the materials
        var materialsObject = {};

        // Loop through each material and construct the key-value pair in the specified format
        allMaterials.forEach((material) => {
            const { material_code, _id, price, number_of_chargers } = material;
            const key = `${material_code}_I_${number_of_chargers}`;
            const value = {id: _id, price:price };
            materialsObject[key] = value;
        });


        // passing these all data to find the list of materials needed as per the question 
        // also determine the price for this 

        const {
            total_cost ,
            labor_rate ,
            service_rate  ,
            material_cost ,
            materials
        } = await material_and_additional_price_determiner(question_set,materialsObject,service_id,number_of_installs,state);
        


        const data =  {
            total_cost:total_cost,
            service_rate:service_rate,
            labor_rate:labor_rate,
            material_cost:material_cost,
            materials:materials
        }

        res.json(data);

    } catch (error) {
        console.log(error);
        res.json(error)
    }
}




module.exports = {
    material_cost_determinatoin_from_questions
}