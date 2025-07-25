const DataTarget = require("../../models/Umum/Data_target.Models");


// GET BY DOMAIN
const getDataTarget = async (req, res) => {
  try {
    const { deleted } = req.params;
    const filter = {};
    if (deleted) filter.Data_target_status = deleted;
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getDataTargetById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterDataTarget = await DataTarget.findById(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY NAME 
const getDataTargetBySalesId = async (req,res) =>{
  try {
    const { id } = req.params;
    const filter = { "Data_target_detail.Data_target_detail_id": id };
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createDataTarget = async (req, res) => {
  try {
    const MasterDataTarget = await DataTarget.create(req.body);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updateDataTarget = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterDataTarget = await DataTarget.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterDataTarget) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterDataTarget = await DataTarget.findById(id);
    res.status(200).json(updatedMasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getDataTarget,
  getDataTargetById,
  getDataTargetBySalesId,
  createDataTarget,
  updateDataTarget,
};
