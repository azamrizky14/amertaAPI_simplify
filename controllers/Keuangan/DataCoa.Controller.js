const DataCoa = require("../../models/Keuangan/DataCoa.Model");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getDataCoa = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Data_coa_status = deleted;
    const ResultData = await DataCoa.find(filter);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BY KODE AKUN
const getDataCoaByKodeAkun = async (req, res) => {
  try {
    const { akun, deleted } = req.params;
    const filter = {
      Data_coa_struktur_akun_code: akun,
    };
    if (deleted) filter.Data_coa_status = deleted;
    const ResultData = await DataCoa.find(filter);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getDataCoaById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const ResultData = await DataCoa.findById(filter);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createDataCoa = async (req, res) => {
  try {
    const ResultData = await DataCoa.create(req.body);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateDataCoa = async (req, res) => {
  try {
    const { id } = req.params;

    const ResultData = await DataCoa.findByIdAndUpdate(id, req.body);

    if (!ResultData) {
      return res.status(404).json({ message: "DataCoa not found" });
    }

    const updatedResultData = await DataCoa.findById(id);
    res.status(200).json(updatedResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDataCoa,
  getDataCoaByKodeAkun,
  getDataCoaById,
  createDataCoa,
  updateDataCoa,
};
