const Tr_pemasukan = require("../../models/Keuangan/Tr_pemasukan.Model");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getTrPemasukan = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Tr_pemasukan_status = deleted;
    const ResultData = await Tr_pemasukan.find(filter);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BY KODE Invoice
const getTrPemasukanByInvoice = async (req, res) => {
  try {
    const { invoice, deleted } = req.params;
    const filter = {
      Tr_pemasukan_invoice: invoice,
    };
    if (deleted) filter.Tr_pemasukan_status = deleted;
    const ResultData = await Tr_pemasukan.find(filter);
    res.status(200).json(ResultData[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getTrPemasukanById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const ResultData = await Tr_pemasukan.findById(filter);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrPemasukan = async (req, res) => {
  try {
    const ResultData = await Tr_pemasukan.create(req.body);
    res.status(200).json(ResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateTrPemasukan = async (req, res) => {
  try {
    const { id } = req.params;

    const ResultData = await Tr_pemasukan.findByIdAndUpdate(id, req.body);

    if (!ResultData) {
      return res.status(404).json({ message: "TrPemasukan not found" });
    }

    const updatedResultData = await Tr_pemasukan.findById(id);
    res.status(200).json(updatedResultData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrPemasukan,
  getTrPemasukanByInvoice,
  getTrPemasukanById,
  createTrPemasukan,
  updateTrPemasukan,
};
