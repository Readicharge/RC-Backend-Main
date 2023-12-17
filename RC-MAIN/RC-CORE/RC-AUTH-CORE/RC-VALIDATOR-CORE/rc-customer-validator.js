const Customer = require("../../RC-CONFIG-CORE/models/RC-CUSTOMER/rc-customer-model")

const validateCustomer= async (data) => {

    try {
      const { email, password } = data;
      console.log(data)
      const customer = await Customer.findOne({ email, password });
      if (customer) {
        // res.json({ valid: true , roles:admin.roles });
        return {
          status:200,
          data:{valid:true,customer:customer}
        }
      } else {
        // res.json({ valid: false });
        return {
          status:200,
          data:{valid:false}
        }
      }
    } catch (error) {
      // res.status(500).json({ error: 'An error occurred while validating the admin.' });
      return {
        status:500,
        data:"Not able to validate the Customer"
      }
    }
  };

  module.exports = {
    validateCustomer
  };