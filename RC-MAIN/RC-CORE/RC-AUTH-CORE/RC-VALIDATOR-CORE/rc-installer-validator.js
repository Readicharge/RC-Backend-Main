const Installer = require("../../RC-CONFIG-CORE/models/RC-INSTALLER/rc-installer-model")

const validateInstaller= async (data) => {

    try {
      const { email, password } = data;
      console.log(data)
      const installer = await Installer.findOne({ email, password });
      if (installer) {
        // res.json({ valid: true , roles:admin.roles });
        await installer.findByIdAndUpdate(installer._id,{isLogged_in:true},{new:true});
        return {
          status:200,
          data:{valid:true,installer:installer}
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
        data:"Not able to validate the Installer"
      }
    }
  };

  module.exports = {
    validateInstaller
  };