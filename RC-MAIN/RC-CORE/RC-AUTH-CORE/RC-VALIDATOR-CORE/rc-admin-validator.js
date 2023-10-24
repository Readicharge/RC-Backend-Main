const Admin = require('../../RC-CONFIG-CORE/models/RC-ADMIN/rc-admin-model')

const validateAdmin = async (data) => {

    try {
      const { email, password } = data;
      console.log(data)
      const admin = await Admin.findOne({ email, password });
      console.log(admin)
      if (admin) {
        // res.json({ valid: true , roles:admin.roles });
        return {
          status:200,
          data:{valid:true,roles:admin.roles}
        }
      } else {
        // res.json({ valid: false });
        return {
          status:200,
          data:{valid:false}
        }
      }
    } catch (error) {
      // res.status(500).json({ error: 'An error occurred while validating the admin.' });
      return {
        status:500,
        data:"Not able to validate the admin"
      }
    }
  };

  module.exports = {
    validateAdmin
  };