const {validateCustomer} = require("../../../../RC-CORE/RC-AUTH-CORE/RC-VALIDATOR-CORE/rc-customer-validator");


const signIn = async (req,res) => {
    try{
        const idata = req.body;
        console.log("idata",idata)
        const odata = await validateCustomer(idata);
        console.log("odata",odata)
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