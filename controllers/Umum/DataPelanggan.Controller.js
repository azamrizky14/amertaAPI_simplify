const DataPelanggan = require("../../models/Umum/DataPelanggan.Models");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getDataPelanggan = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.data_pelanggan_status = deleted;
    const MasterDataPelanggan = await DataPelanggan.find(filter);
    res.status(200).json(MasterDataPelanggan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Prefix
const getDataPelangganPrefix = async (req, res) => {
  try {
    const prefix = "0"; // contoh prefix

    // Cari data tertinggi berdasarkan ID yang diawali prefix
    const data = await DataPelanggan.findOne({
      data_pelanggan_id: { $regex: `^${prefix}` },
    }).sort({ data_pelanggan_id: -1 });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama
    if (!data) {
      return res.json({ nextId: `${prefix}00000000` });
    }

    // Ambil ID terakhir dan tambahkan 1
    const lastId = data.data_pelanggan_id;
    const numericPart = parseInt(lastId.slice(prefix.length), 10); // ambil angka setelah prefix
    const nextNumericPart = (numericPart + 1).toString().padStart(1, "0"); // jaga agar tetap 1 digit

    const nextId = `${prefix}${nextNumericPart}`;

    return res.json({ nextId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getDataPelangganById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterDataPelanggan = await DataPelanggan.findById(filter);
    res.status(200).json(MasterDataPelanggan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createDataPelanggan = async (req, res) => {
  try {
    const MasterDataPelanggan = await DataPelanggan.create(req.body);
    res.status(200).json(MasterDataPelanggan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updateDataPelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterDataPelanggan = await DataPelanggan.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterDataPelanggan) {
      return res.status(404).json({ message: "DataPelanggan not found" });
    }

    const updatedMasterDataPelanggan = await DataPelanggan.findById(id);
    res.status(200).json(updatedMasterDataPelanggan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getDataPelanggan,
  getDataPelangganPrefix,
  getDataPelangganById,
  createDataPelanggan,
  updateDataPelanggan,
};
