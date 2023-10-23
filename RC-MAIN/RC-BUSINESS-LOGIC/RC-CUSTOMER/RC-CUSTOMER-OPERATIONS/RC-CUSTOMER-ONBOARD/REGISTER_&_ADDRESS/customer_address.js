// This function is used for updating the address of the Customer, but the core function is going to be used at different scenarios for 
// updating the other things as well


const { updateCustomer } = require("../../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-CUSTOMER/rc-customer-controller");

const update_address = async (req,res) => {

    const frontEnd_passed_data = req.body;
    const customerId = req.params.id;

    // When the address data is filled then the customer is considered to be registerd at our platform 
    const data = {isRegisteration_completed:true,isLogged_in:true,...frontEnd_passed_data};
    
    const response = await updateCustomer(data,customerId);

    if(response.status===200)
    {
        res.status(200).json({data:response.data});
    }
    else
    {
        res.status(500).json({data:response.data});
    }
}


module.exports = {
    update_address
}