// Importing the Dependent Modules
const Service = require("../../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-SERVICE/rc-service-model");


// The format of the question will be like this 
// [{"1":"1","2":"2a",.....}]



const service_determiner = async (question_list) => {
    // We will get the set of questions from the client and we will use that to find the service alloted to the customer.

    // Here we will have the list of all the services which are available for the customer to select for autcalculating the price.
    const available_service_tiers = ["BI", "II", "AI", "AI80"]
    // Set the default value of the service_selected to null
    var service_selected = null;
    // First we will take the list and we will find that which are the combinations which are there present and if any of the combinations is there then we will use the service alloted for that service 
    if (question_list.cd2_3 === "Hardwired" && question_list.cd2_3a === null ) 
    {
        service_selected = available_service_tiers[3];
    }
    else if (
        (question_list.cd2_5b === "Outside" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_5c === "true" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_8a === "true" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_8 === "Outside" && question_list.cd2_14 === "0-25 feet")
    ) 
    {
        service_selected = available_service_tiers[0];
    }
    else if (
        (question_list.cd2_5c === "true" && question_list.cd2_14 === "26-50 feet")
        || (question_list.cd2_5b === "Outside" && question_list.cd2_14 === "26-50 feet")
        || (question_list.cd2_5b === "Basement" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_5d === "false" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_8 === "Outside" && question_list.cd2_14 === "26-50 feet")
        || (question_list.cd2_8 === "Basement" && question_list.cd2_14 === "0-25 feet")
        || (question_list.cd2_8a === "true" && question_list.cd2_14 === "26-50 feet")
        || (question_list.cd2_8b === "false" && question_list.cd2_14 === "0-25 feet")
    ) 
    {
        service_selected = available_service_tiers[1];
    }
    else if (
        
        (question_list.cd2_5b === "Outside" && (question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_8 === "Outside" && (question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_5b === "Basement" && (question_list.cd2_14 === "26-50 feet" || question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_8 === "Basement" && (question_list.cd2_14 === "26-50 feet" || question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_5c === "true" && (question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_5d === "false" && (question_list.cd2_14 === "26-50 feet" || question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_8a === "true" && (question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
        || (question_list.cd2_8b === "false" && (question_list.cd2_14 === "26-50 feet" || question_list.cd2_14 === "51-75 feet" || question_list.cd2_14 === "76-100 feet"))
    ) 
    {
        service_selected = available_service_tiers[2];
    }

    const service = await Service.findOne({service_code:service_selected})
    console.log(service)
    
    return service;

}







module.exports = {
    service_determiner,

}