const DataDrafter = require("../../models/Umum/DataDrafter.Models");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getDataDrafter = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.data_drafter_status = deleted;
    const MasterDataDrafter = await DataDrafter.find(filter);
    res.status(200).json(MasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getDataDrafterById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterDataDrafter = await DataDrafter.findById(filter);
    res.status(200).json(MasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDataDrafterByServer = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const { server } = req.body;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain, data_drafter_server: server };
    if (deleted) filter.data_drafter_status = deleted;
    const MasterDataDrafter = await DataDrafter.find(filter);
    res.status(200).json(MasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDataDrafterByType = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, server } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain, data_drafter_type: server };
    if (deleted) filter.data_drafter_status = deleted;
    const MasterDataDrafter = await DataDrafter.find(filter);
    res.status(200).json(MasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createDataDrafter = async (req, res) => {
  try {
    const MasterDataDrafter = await DataDrafter.create(req.body);
    res.status(200).json(MasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updateDataDrafter = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterDataDrafter = await DataDrafter.findByIdAndUpdate(id, req.body);

    if (!MasterDataDrafter) {
      return res.status(404).json({ message: "DataDrafter not found" });
    }

    const updatedMasterDataDrafter = await DataDrafter.findById(id);
    res.status(200).json(updatedMasterDataDrafter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getDataDrafter,
  getDataDrafterById,
  getDataDrafterByServer,
  getDataDrafterByType,
  createDataDrafter,
  updateDataDrafter,
};
