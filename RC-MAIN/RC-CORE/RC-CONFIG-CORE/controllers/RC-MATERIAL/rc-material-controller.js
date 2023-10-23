const Materials = require('../../models/RC-MATERIAL/rc-material-model');



 // Create a new material
const createMaterial = async (data) => {
  try {
    const material = new Materials(data);
    await material.save();
    // res.status(201).json(material);
    return {
      status : 201,
      data : "Material create Successfully"
    }
  } catch (error) {
    // res.status(400).json({ error: error.message });
    return {
      status:400,
      data:"Not able to create the material"
    }
  }
};




 // Delete a material
const deleteMaterial = async (id) => {
  try {
    const material = await Materials.findByIdAndDelete(id);
    if (!material) {
      // return res.status(404).json({ error: 'Material not found' });
      return {
        status : 404,
        data : "Material not found"
      }
    }
    // res.json(material);
    return {
      status : 200,
      data : "Material successfully Deleted"
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
    return {
      status : 500 , 
      data : "Not able to delete the material"
    }
  }
};


 // Update a material
const updateMaterial = async (id,data) => {
  try {
    const material = await Materials.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!material) {
      return {
        status : 404,
        data : "Material not found"
      }
      // return res.status(404).json({ error: 'Material not found' });
    }
    return {
      status : 200,
      data : "Material successfully updated"
    }
  } catch (error) {
    // res.status(400).json({ error: error.message });
    return {
      status : 500 , 
      data : "Not able to update the material"
    }
  }
};
 // Get all materials
const getAllMaterials = async () => {
  try {
    const materials = await Materials.find();
    // res.json(materials);
    return {
      status : 200 , 
      data : materials
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
    return {
      status : 500,
      data : "Not able to get the materials"
    }
  }
};
 // Get a specific material
const  getMaterialById = async (req, res) => {
  try {
    const material = await Materials.findById(req.params.id);
    if (!material) {
      // return res.status(404).json({ error: 'Material not found' });
      return {
        status : 404,
        data : "Material not found"
      }
    }
    // res.json(material);
    return {
      status:200,
      data : material
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
    return {
      status:500,
      data : "Not able to get the material"
    }
  }
};

module.exports = {createMaterial,deleteMaterial,updateMaterial,getAllMaterials,getMaterialById};