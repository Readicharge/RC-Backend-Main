const Customer = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER/rc-customer-model");



// logging out the customer 

const logoffCustomer = async (req,res)=> {
    try{
        // Getting the customer Id 
        const customerId = req.params.id;
        
        // Getting the Customer and Update it's login Status 
        const customerUpdated = Customer.findByIdAndUpdate(customerId,{isLogged_in:false},{new:true});

        res.status(200).json("Customer Logged Out Successfully")

    }
    catch(error)
    {
        res.status(500).json("Something Went Wrong: ",error)
    }
}


module.exports = {
    logoffCustomer 
}