const Cronjob = require("../../models/cronjobmodel/CronJob.Models");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getCronjob = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Cronjob_status = deleted;
    const MasterCronjob = await Cronjob.find(filter);
    res.status(200).json(MasterCronjob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getCronjobById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterCronjob = await Cronjob.findById(filter);
    res.status(200).json(MasterCronjob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createCronjob = async (req, res) => {
  try {
    const MasterCronjob = await Cronjob.create(req.body);
    res.status(200).json(MasterCronjob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateCronjob = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterCronjob = await Cronjob.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterCronjob) {
      return res.status(404).json({ message: "Cronjob Tidak ada" });
    }

    const updatedMasterCronjob = await Cronjob.findById(id);
    res.status(200).json(updatedMasterCronjob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCronjob,
  getCronjobById,
  createCronjob,
  updateCronjob,
};
