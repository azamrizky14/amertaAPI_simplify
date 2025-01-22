const Master_harga_material = require("../models/Master_harga_material.model");

// GET BY DOMAIN
const getMasterHargaMaterial = async (req, res) => {
  try {
    const MasterHargaMaterial = await Master_harga_material.find({master_harga_material_domain:req.params.domain, master_harga_material_status:"Y"});
    res.status(200).json(MasterHargaMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getMasterHargaMaterialid = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterHargaMaterial = await Master_harga_material.findById(id);
    res.status(200).json(MasterHargaMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createMasterHargaMaterial = async (req, res) => {
  try {
    const MasterHargaMaterial = await Master_harga_material.create(req.body);
    res.status(200).json(MasterHargaMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated MasterHargaMaterial 
const updateMasterHargaMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterHargaMaterial = await Master_harga_material.findByIdAndUpdate(id, req.body);

    if (!MasterHargaMaterial) {
      return res.status(404).json({ message: "MasterHargaMaterial not found" });
    }

    const updatedMasterHargaMaterial = await Master_harga_material.findById(id);
    res.status(200).json(updatedMasterHargaMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATED MASTER ITEM STOK 
const updateMasterHargaMaterialStok = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterHargaMaterial = await Master_harga_material.findByIdAndUpdate(id, {
      item_stok:req.body.item_stok
    });

    if (!MasterHargaMaterial) {
      return res.status(404).json({ message: "MasterHargaMaterial not found" });
    }

    const updatedMasterHargaMaterial = await Master_harga_material.findById(id);
    res.status(200).json(updatedMasterHargaMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated Master Item ngambil item history
const updatedMasterHargaMaterialHistory = async(req,res) =>{
  try {
    const {id} = req.params;
    const MasterHargaMaterial = await Master_harga_material.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      item_stok:req.body.item_stok,
      $push:{item_history:req.body.item_history}}
      );

    if(!MasterHargaMaterial){
      return res.status(404).json({ message:"MasterHargaMaterial tidak ada"});
    }
    const updatedMasterHargaMaterialHistory = await Master_harga_material.findById(id);
    res.status(200).json(updatedMasterHargaMaterialHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getMasterHargaMaterial,
  getMasterHargaMaterialid,
  createMasterHargaMaterial,
  updateMasterHargaMaterial,
  updateMasterHargaMaterialStok,
  updatedMasterHargaMaterialHistory
};
