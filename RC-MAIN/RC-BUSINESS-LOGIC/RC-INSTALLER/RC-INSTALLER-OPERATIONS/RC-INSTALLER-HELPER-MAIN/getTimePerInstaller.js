const {getTimeperInstaller} = require("../../../../RC-CORE/RC-CONFIG-CORE/controllers/RC-TIME/rc-time-controller");



const getTimePerInstaller = async (req,res) => { 
    try {
        const installerId = req.params.id;
        const response = await getTimeperInstaller(installerId);

        if(response.status ===200)
        {
            res.status(200).json(response.data);
        }
        else
        {
            res.status(404).json(response.data);
        }
    }
    catch(err)
    {
        res.status(500).json({message:"Something wnt wrong!"});
    }
}


module.exports = {
    getTimePerInstaller
}