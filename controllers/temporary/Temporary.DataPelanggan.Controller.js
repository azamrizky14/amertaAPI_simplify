const TemporaryDataPelanggan = require("../../models/temporary/Temporary.DataPelanggan.Model");

// GET BY DOMAIN
const getTemporaryDataPelanggan = async (req, res) => {
  try {
    const { cabang } = req.params;
    const { listData } = req.query;

    let projection = {}; // projection default kosong

    if (listData) {
      const fields = listData.split("-"); // contoh: "companyName-ticketName-_id"
      
      projection = fields.reduce((acc, key) => {
        acc[key] = 1;
        return acc;
      }, {});
    }

    const data = await TemporaryDataPelanggan.find({ cabang: cabang }, projection).lean();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getTemporaryDataPelangganById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const data = await TemporaryDataPelanggan.findById(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Find One by Catatan 
const getTemporaryDataPelangganByCatatan = async (req, res) => {
  try {
    const { note } = req.params;
    const filter = { Catatan: note };
    const data = await TemporaryDataPelanggan.findOne(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Find one by SN 
const getTemporaryDataPelangganBySN = async (req, res) => {
  try {
    const { serial } = req.params;
    const filter = { SN: serial };
    const data = await TemporaryDataPelanggan.findOne(filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createTemporaryDataPelanggan = async (req, res) => {
  try {
    const data = await TemporaryDataPelanggan.create(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updateTemporaryDataPelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    const reqdata = await TemporaryDataPelanggan.findByIdAndUpdate(id, req.body);

    if (!reqdata) {
      return res.status(404).json({ message: "Not found" });
    }

    const data = await TemporaryDataPelanggan.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getTemporaryDataPelanggan,
  getTemporaryDataPelangganById,
  getTemporaryDataPelangganByCatatan,
  getTemporaryDataPelangganBySN,
  createTemporaryDataPelanggan,
  updateTemporaryDataPelanggan,
};
