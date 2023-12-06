const Customer = require("../../../../RC-CORE/RC-CONFIG-CORE/models/RC-CUSTOMER/rc-customer-model");
const {deleteCustomerById} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-CUSTOMER/rc-customer-controller");


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

const deleteCustomer = async (req,res) => {
    try {
        const customerId = req.params.id;
        const response = await deleteCustomerById(customerId);
        res.status(response.status).json(response.odata);
    }
    catch(error)
    {   
        console.log(error)
        res.status(500).json(error);
    }
}

const getCustomerId = async (req,res) => {
    try{
        const customerId = req.params.id;
        const response = await Customer.findById(customerId);
        res.status(200).json(response);
    }
    catch(error)
    {
        res.status(500).json(error);
    }
}

module.exports = {getCustomerAll,deleteCustomer,getCustomerId}