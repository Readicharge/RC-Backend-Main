const {validateAdmin} = require("../../../../RC-CORE/RC-AUTH-CORE/RC-VALIDATOR-CORE/rc-admin-validator");

const sign_in_admin = async (req,res) => {
    const data = req.body;
    const response_from_core = await validateAdmin(data);
    console.log(response_from_core)
    if(response_from_core.status===200)
    {
     res.status(200).json(response_from_core.data)
    }
    else
    {
     res.status(500).json(response_from_core.data);
    }
};


module.exports = {
    sign_in_admin
}