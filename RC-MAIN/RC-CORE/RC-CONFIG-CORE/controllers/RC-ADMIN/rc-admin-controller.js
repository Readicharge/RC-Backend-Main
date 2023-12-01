const Admin = require('../../models/RC-ADMIN/rc-admin-model');
const { findMostRecentAdmin } = require('../../../RC-UNIQUE_ID-CORE/admins/adminIdGenerator');

// CRUD operations

// Create a new admin
const createAdmin = async (idata) => {
  try {
    const { name, email, phoneNumber, address, password, roles } = idata;

    const last_sequence_number = await findMostRecentAdmin();
    const current_sequence_number = last_sequence_number + 1;
    const unique_admin_id = `RC-A-${current_sequence_number}`;

    // let admin_image = null;
    // let imageMimeType = null;

    // // Check if there's an image uploaded in the request
    // if (req.file && req.file.buffer) {
    //   // Set the image data and MIME type
    //   admin_image = req.file.buffer;
    //   imageMimeType = req.file.mimetype;
    // }

    const data = {
      readicharge_unique_id: unique_admin_id,
      name,
      email,
      phoneNumber,
      address,
      password,
      roles,
      sequence_number: current_sequence_number,
    };

    console.log(data);

    const admin = await Admin.create(data);

    // res.status(201).json(admin);
    return {
      status : 200 , 
      odata : admin 
    }

  } catch (error) {
    // res.status(500).json({ error: error.message });
    return {
      status : 500 ,
      odata : error
    }
  }
};



const getAdmin = async () => {
  try {
    const admin = await Admin.find();
    return {
      status : 200,
      odata : admin
    }
  } catch (error) {
     return {
      status : 500,
      odata : error
     }
  }
};

// Read admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the admin.' });
  }
};

// Update admin by ID
const updateAdminById = async (id,idata) => {
  try {
    const admin = await Admin.findByIdAndUpdate(id, idata, { new: true });
    if (!admin) {
     
      return {
        status : 404,
        odata : "Admin Not Found!"
      }
    }
    return {
      status : 200,
      odata : "Admin updated Successfully"
    }
  } catch (error) {
    console.log(error)
    return {
      status : 500,
      odata : error
    }
  }
};

// Delete admin by ID
const deleteAdminById = async (adminId) => {
  try {
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      return {
        status : 404,
        odata : "Admin Not Found!"
      }
    }
    return {
      status : 302,
      odata : "Admin Deteled Successfully"
    };
  } catch (error) {
    return {
      status : 500,
      odata : "Error occured while deleting the Admin"
    }
  }
};



module.exports = {
  getAdmin,
  createAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById
};
