const {validateCustomer} = require("../../../../RC-CORE/RC-AUTH-CORE/RC-VALIDATOR-CORE/rc-customer-validator");


const signIn = async (req,res) => {
    try{
        const idata = req.body;
        const odata = await validateCustomer(idata);
        console.log("Odata",odata)
        res.status(200).json(odata)

    }
    catch(err)
    {
        res.status(500).json(EvalError)
    }
}




module.exports = {
    signIn
}