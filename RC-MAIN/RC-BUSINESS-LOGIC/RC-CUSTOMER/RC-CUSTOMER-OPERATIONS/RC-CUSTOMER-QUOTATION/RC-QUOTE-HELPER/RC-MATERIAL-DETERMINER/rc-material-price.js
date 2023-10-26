// Importing the Dependent Modules
const LabourRate = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-LABOR_RATE/rc-labor_rate-model");
const Service = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model");
const CustomerRates = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER-RATE/rc-customer_rate-model");


// This will also get the list as material code and their value respectively 
// here the object available materials will have the id of that material respectively 

const material_and_additional_price_determiner = async (question_list, available_materials, service_id, number_of_installs,state) => {


    // These are the fields which are needed to be taken from the client side
    // question_list, available_materials, service_id, number_of_installs


    console.log(available_materials)

    
    let total_cost = 0;
    let material_cost = 0;

    const materials_added = []

    const service_obj = Service.findById(service_id);
    const service = service_obj.service_code;
    
    const customer_showing_cost_model = await CustomerRates.findOne({service_id:service_id , number_of_installs :number_of_installs });
    const customer_showing_cost = customer_showing_cost_model.price;
    
    const labourRatesObj = await LabourRate.findOne({ service_id: service_id, number_of_installs: number_of_installs });
    const labourRates = labourRatesObj.price_statewise.find((priceObj) => priceObj.state === state).price;

    // Adding the Missilaneous material into it 
    materials_added.push(available_materials[`Misc_Material_I_${number_of_installs - 1}`].id);
    material_cost += number_of_installs * available_materials[`Misc_Material_I_${number_of_installs - 1}`].price;

    // Adding the Breaker into it 
    materials_added.push(available_materials[`Breaker_I_${number_of_installs - 1}`].id);
    material_cost += number_of_installs * available_materials[`Breaker_I_${number_of_installs - 1}`].price;

    if ((question_list.r2_a === "true" && service !== "AI80") || (question_list.cd2_2a === "true")) {
        materials_added.push(available_materials[`NMEA_14_15_outlet_I_${number_of_installs - 1}`].id);
        material_cost += number_of_installs * available_materials[`NMEA_14_15_outlet_I_${number_of_installs - 1}`].price;
    }
    if ((question_list.cd1_1c === "true" && service === "AI80") || (question_list.cd1_1c === "false" && question_list.cd2_3a === "80A - 19.2kw")) {
        materials_added.push(available_materials[`Panel_Load_Central_80_100_A_I_${number_of_installs - 1}`].id);
        material_cost += number_of_installs * available_materials[`Panel_Load_Central_80_100_A_I_${number_of_installs - 1}`].price;
    }
    // space for cd2-13 and cd2-13b
    if (question_list.cd2_3a !== "80A - 19.2kw") {
        if (question_list.cd2_11 === "true" && (question_list.cd2_13 === "125A" || question_list.cd2_13 === "150A")) {
            materials_added.push(available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].id)
            material_cost += number_of_installs * available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].price;
        }
        if (question_list.cd2_11 === "false" && (question_list.cd2_13 !== "60A" && question_list.cd2_13 !== "100A")) {
            materials_added.push(available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].id)
            material_cost += number_of_installs * available_materials[`Panel_Load_Center_60A_I_${number_of_installs - 1}`].price;
        }
    }
    // Space for the 4/4 wire
    if (question_list.cd2_14 === "0-25 feet" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_25_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_25_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "26-50 feet" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_50_I_I${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_50_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "51-75 feet" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_75_I_I${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_75_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "76-100 feet" && (service === "BI" || service === "II" || service === "AI")) {
        materials_added.push(available_materials[`Wire_4_4_100_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_4_4_100_I_${number_of_installs - 1}`].price;
    }

    // SPACE FOR THE 3/4 WIRE TYPE
    if (question_list.cd2_14 === "0-25 feet" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_25_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_25_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "26-50 feet" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_50_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_50_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "51-75 feet" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_75_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_75_I_${number_of_installs - 1}`].price;
    }
    if (question_list.cd2_14 === "76-100 feet" && (service === "AI80")) {
        materials_added.push(available_materials[`Wire_3_4_100_I_${number_of_installs - 1}`].id)
        material_cost += number_of_installs * available_materials[`Wire_3_4_100_I_${number_of_installs - 1}`].price;
    }


    total_cost = material_cost + labourRates;



    return {
        total_cost : total_cost,
        labor_rate : labourRates,
        service_rate : customer_showing_cost,
        material_cost : material_cost,
        materials : materials_added
    }


}



module.exports = {
    material_and_additional_price_determiner
}