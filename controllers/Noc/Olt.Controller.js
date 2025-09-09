const Olt = require("../../models/Noc/Olt.Model");

// GET BY DOMAIN
const getOlt = async (req, res) => {
  try {
    const { companyName } = req.params;
    const filter = { companyName: companyName };
    const MasterOlt = await Olt.find(filter);
    res.status(200).json(MasterOlt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getOltById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterOlt = await Olt.findById(filter);
    res.status(200).json(MasterOlt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createOlt = async (req, res) => {
  try {
    const MasterOlt = await Olt.create(req.body);
    res.status(200).json(MasterOlt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated OLT
const updateOlt = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterOlt = await Olt.findByIdAndUpdate(id, req.body);

    if (!MasterOlt) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterOlt = await Olt.findById(id);
    res.status(200).json(updatedMasterOlt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getOlt,
  getOltById,
  createOlt,
  updateOlt,
};
