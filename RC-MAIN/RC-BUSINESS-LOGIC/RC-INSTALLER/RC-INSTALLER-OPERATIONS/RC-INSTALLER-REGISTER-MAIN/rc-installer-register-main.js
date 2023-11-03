
// Section to create the new Installer on the Readicharge platfrom 

// importing the dependencies 
const {createInstaller} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller");




// Declaring the main Business code for registerin the Installer 

const Register_the_Installer = async (req,res) => {

    try{
        const data = req.body;
        const response = await createInstaller(data);

        if(response.status ===200) res.status(200).json({data:response.data})
        else res.status(500).json({data: "Not able to create the installer"});
    }
    catch(err)
    {
        res.status(500).json({data:"Not able to create the Installer"});
    }
}


module.exports ={
    Register_the_Installer
}