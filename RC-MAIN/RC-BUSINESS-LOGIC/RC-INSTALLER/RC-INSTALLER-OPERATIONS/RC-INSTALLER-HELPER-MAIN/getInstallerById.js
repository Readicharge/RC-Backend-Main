const getInstallerById = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-INSTALLER/rc-installer-controller")


const getSpecificInstaller = async (req,res) => {
    const data = req.params.id;
    const response_from_core = await getInstallerById(data);
    res.json(response_from_core);

}




module.exports = {
    getSpecificInstaller
}