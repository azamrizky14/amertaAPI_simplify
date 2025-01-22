const Master_supplier = require("../models/Master_supplier.model");

// GET DATA
const getMasterSupplier = async (req, res) => {
  try {
    const MasterSupplier = await Master_supplier.find({master_supplier_status:"Y"});
    res.status(200).json(MasterSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getMasterSupplierid = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterSupplier = await Master_supplier.findById(id);
    res.status(200).json(MasterSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createMasterSupplier = async (req, res) => {
  try {
    const MasterSupplier = await Master_supplier.create(req.body);
    res.status(200).json(MasterSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated MasterItem 
const updateMasterSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterSupplier = await Master_supplier.findByIdAndUpdate(id, req.body);

    if (!MasterSupplier) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterSupplier = await Master_supplier.findById(id);
    res.status(200).json(updatedMasterSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getMasterSupplier,
    getMasterSupplierid,
    createMasterSupplier,
    updateMasterSupplier
};
