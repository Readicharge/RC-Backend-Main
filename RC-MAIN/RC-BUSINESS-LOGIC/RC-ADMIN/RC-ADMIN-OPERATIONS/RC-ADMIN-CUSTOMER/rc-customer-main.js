const Customer = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER/rc-customer-model")


const getCustomerAll = async (req,res) => {
    try{
        const customers = await Customer.find();
        if(customers.length===0)
        {
            res.status(404).json(customers);
        }
        res.status(200).json(customers);
    }
    catch(error){
        res.status(500).json("Not able to get the customers");
    }
}



module.exports = {getCustomerAll}