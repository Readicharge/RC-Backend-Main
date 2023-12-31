const Admin = require("../../RC-CONFIG-CORE/models/RC-ADMIN/rc-admin-model")

// Function to find the most recent admin
exports.findMostRecentAdmin = async () => {
    try {
      // Find the most recent admin based on the createdAt field in descending order
      const mostRecentAdmin = await Admin.findOne().sort({ sequence_number: -1 });
      
      if(mostRecentAdmin===null){
        console.log("The start for the creation of super admin is here")
        return 0;
      }
      console.log(mostRecentAdmin)
      return mostRecentAdmin.sequence_number;
    } catch (error) {
       return null;
    }
  };