const {createAdmin} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-ADMIN/rc-admin-controller");


const createAdmin = async (req,res) => {
    try{
        const idata = req.body;
        const response = await createAdmin(idata);
        if(response.status === 200) {
            res.status(200).json({data:response.odata});
        }
        else
        {
            res.status(400).json({data:response.odata});
        }
    }
    catch(err){
        res.status(500).json(err)
    }
}




module.exports = {
    createAdmin
}