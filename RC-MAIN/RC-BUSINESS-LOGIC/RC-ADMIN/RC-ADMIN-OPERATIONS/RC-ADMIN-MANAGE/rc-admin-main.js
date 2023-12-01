const {createAdmin,getAdmin,deleteAdminById,updateAdminById} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-ADMIN/rc-admin-controller");


const createAdminServer = async (req,res) => {
    try{
        const idata = req.body;
        const response = await createAdmin(idata);
        if(response.status === 204) {
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


const getAdminServer = async (req,res) => {
    try {
        const response = await getAdmin();
        if(response.status ===200 )
        {
            res.status(200).json({odata:response.odata});
        }
        else
        {
            res.status(500).json({odata:response.odata});
        }
       
    }
    catch(err) {
        res.status(500).json(err)
    }

}


const deleteAdminServer = async (req,res) => {
    try {
        const response = await deleteAdminById(req.params.id);
        if(response.status===302)
        {
            res.status(300).json(response.odata);
        }
        else
        {
            res.status(404).json(response.odata);
        }
    }
    catch(error)
    {
        res.status(500).json(error)
    }
}

const updateAdmin = async ( req,res) => {
    try {
        const adminId = req.params.id;
        const response = await updateAdminById(adminId, req.body)
        console.log("Hi",response)
        res.status(response.status).json(response.odata)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}



module.exports = {
    createAdminServer,
    getAdminServer,
    deleteAdminServer,
    updateAdmin
}