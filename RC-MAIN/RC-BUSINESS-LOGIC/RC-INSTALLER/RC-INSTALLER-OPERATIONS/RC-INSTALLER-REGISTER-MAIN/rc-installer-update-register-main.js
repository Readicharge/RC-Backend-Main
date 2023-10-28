// importing the dependencies 
const {updateInstaller} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller");


// Update the installer by id
const Update_Registration_User = async (req,res) => {

    try{
        const data = req.body;
        const installerId = req.params.installerId;
        const response = await updateInstaller(data,installerId);

        if(response.status ===200) res.status(200).json({data:"Installer Successfully Updated"})
        else res.status(500).json({data: "Not able to update the installer"});
    }
    catch(err)
    {
        res.status(500).json({data:"Not able to update the Installer"});
    }
};



module.exports = {
    Update_Registration_User
}