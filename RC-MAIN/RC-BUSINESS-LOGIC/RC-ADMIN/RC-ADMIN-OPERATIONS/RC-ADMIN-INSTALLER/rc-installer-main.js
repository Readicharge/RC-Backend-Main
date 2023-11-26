const {getInstallers, deleteInstaller} =  require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller");

const getInstallerServer = async (req,res) => {
    const resposne_from_core = await getInstallers();
    if(resposne_from_core.status === 200) {
        res.status(200).json({odata:resposne_from_core.odata});
    }
    else{
        res.status(400).json({odata:[]});
    }
}


const deleteInstallerServer = async (req,res) => {
    const response = await deleteInstaller(req.params.id);
    if(response.status === 200) {
        res.status(200).json({odata:response.odata});
    }
    else{
        res.status(400).json({odata:response.odata});
    }
}



module.exports = {
    getInstallerServer,
    deleteInstallerServer
}
