const CustomerRates = require("../../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER-RATE/rc-customer_rate-model");
const {service_determiner} = require("../RC-QUOTE-HELPER/RC-SERVICE-DETERMINER/rc-service-determiner")






const determine_quotation = async (req,res) => {
    const { question_list, number_of_installs } = req.body;
    const determined_service = [];
    for (let i = 0; i < number_of_installs; i++) {
      const service = await service_determiner(question_list[i]);
      determined_service.push(service);
    }
    
    const priority_list = ['AI80','AI','II','BI']
    
    // Create a mapping of service_code to their priority
    const priorityMapping = {};
    priority_list.forEach((code, index) => {
      priorityMapping[code] = index;
    });
    
    // Find the service with the highest priority
    let highestPriorityService = null;
    
    determined_service.forEach((service) => {
      if (!highestPriorityService) {
        highestPriorityService = service;
      } else {
        const currentPriority = priorityMapping[service.service_code];
        const highestPriority = priorityMapping[highestPriorityService.service_code];
    
        if (currentPriority < highestPriority) {
          highestPriorityService = service;
        }
      }
    });

    console.log(highestPriorityService)

    // res.json(highestPriorityService)


    // Getting the Price for the given service
    const quote = await CustomerRates.findOne({service_id:highestPriorityService._id , number_of_installs:number_of_installs});

    const data_to_send_as_response = {
      services:determined_service,
      quotation:quote.price
    }
  
    if(quote) {
        res.status(200).json(data_to_send_as_response);
    }
    else{
        res.status(500).json({message:quote})
    }

}


module.exports = {
    determine_quotation
}