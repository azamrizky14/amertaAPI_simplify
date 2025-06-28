const PortGateway = require("../../models/Umum/PortGateway.Models");


// GET BY DOMAIN
const getPortGateway = async (req, res) => {
  try {
    const { deleted } = req.params;
    const filter = {};
    if (deleted) filter.PortGateway_status = deleted;
    const MasterPortGateway = await PortGateway.find(filter);
    res.status(200).json(MasterPortGateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getPortGatewayById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterPortGateway = await PortGateway.findById(filter);
    res.status(200).json(MasterPortGateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getPortgatewayPrefix = async (req, res) => {
  try {
      const prefix = "PORTGATEWAY";

      // Cari semua dokumen yang memiliki prefix sesuai di database
      const data = await PortGateway.find({
          PortGateway_id: { $regex: `^${prefix}` },
      });

      // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
      if (data.length === 0) {
          return res.json({ nextId: `${prefix}-001` });
      }

      // Cari ID dengan angka terbesar dari hasil query
      const latestId = data.reduce((maxId, currentItem) => {
          const currentNumber = parseInt(
              currentItem.PortGateway_id.split("-").pop() || "0"
          );
          const maxNumber = parseInt(maxId.split("-").pop() || "0");
          return currentNumber > maxNumber ? currentItem.PortGateway_id : maxId;
      }, "");

      // Ambil angka dari ID terbaru dan tambahkan 1
      const latestNumber = parseInt(latestId.split("-").pop() || "0");
      const nextNumber = (latestNumber + 1).toString().padStart(3, "0");

      // Gabungkan prefix dengan angka yang baru
      const nextId = `${prefix}-${nextNumber}`;

      // Kembalikan hasilnya
      res.json({ nextId });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// CREATE
const createPortGateway = async (req, res) => {
  try {
    const MasterPortGateway = await PortGateway.create(req.body);
    res.status(200).json(MasterPortGateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updatePortGateway = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterPortGateway = await PortGateway.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterPortGateway) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterPortGateway = await PortGateway.findById(id);
    res.status(200).json(updatedMasterPortGateway);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getPortGateway,
  getPortgatewayPrefix,
  getPortGatewayById,
  createPortGateway,
  updatePortGateway,
};
