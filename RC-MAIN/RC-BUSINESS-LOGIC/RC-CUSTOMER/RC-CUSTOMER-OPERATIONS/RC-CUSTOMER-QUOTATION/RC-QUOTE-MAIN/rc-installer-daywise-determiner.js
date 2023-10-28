const {installerAvailability_for_Service_and_Location} = require("../RC-QUOTE-HELPER/RC-INSTALLER-FINDER/rc-installer-list-day");


const get_installer_avail_in_month_days = async (req,res) => {


    // Getting these as input in the data 
    // addressLine1, addressLine2, zip, state, city , serviceId , date
    const data = req.body;



    const response = await installerAvailability_for_Service_and_Location(data);
    


    res.json(response);
}



module.exports = {
    get_installer_avail_in_month_days
}