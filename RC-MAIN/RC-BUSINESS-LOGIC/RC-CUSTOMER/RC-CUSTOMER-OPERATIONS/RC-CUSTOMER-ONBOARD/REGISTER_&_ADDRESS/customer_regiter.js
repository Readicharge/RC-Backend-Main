const { createCustomer } = require("../../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-CUSTOMER/rc-customer-controller");

// API Function to register the customer 
const register_customer = async (req,res) =>{
    
    const data = req.body;
    const response = await createCustomer(data);

    if(response.status === 200) {
        res.status(200).json({data:response.data});
    }

    else
    {
        res.status(400).json({data:response.data});
    }


}



module.exports={
    register_customer
}