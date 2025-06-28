const Announcement = require("../../models/Umum/Announcement.Models");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getAnnouncement = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Announcement_status = deleted;
    const MasterAnnouncement = await Announcement.find(filter);
    res.status(200).json(MasterAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BY Kategori
const getAnnouncementByKategori = async (req, res) => {
  try {
    const { domain, hierarchy, kategori, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain, Announcement_category: kategori };
    if (deleted) filter.Announcement_status = deleted;
    const MasterAnnouncement = await Announcement.find(filter);
    res.status(200).json(MasterAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getAnnouncementPrefix = async (req, res) => {
  try {
      const { type, date } = req.params;

      const newDate = date.replace(/-/g, "");
      // Buat prefix berdasarkan parameter `type` dan `date`
      const prefix = `${type}-${newDate}`;

      // Cari semua dokumen yang memiliki prefix sesuai di database
      const data = await Announcement.find({
          Announcement_id: { $regex: `^${prefix}` },
      });

      // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
      if (data.length === 0) {
          return res.json({ nextId: `${prefix}-001` });
      }

      // Cari ID dengan angka terbesar dari hasil query
      const latestId = data.reduce((maxId, currentItem) => {
          const currentNumber = parseInt(
              currentItem.Announcement_id.split("-").pop() || "0"
          );
          const maxNumber = parseInt(maxId.split("-").pop() || "0");
          return currentNumber > maxNumber ? currentItem.Announcement_id : maxId;
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

// FIND ONE BY ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterAnnouncement = await Announcement.findById(filter);
    res.status(200).json(MasterAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createAnnouncement = async (req, res) => {
  try {
    const MasterAnnouncement = await Announcement.create(req.body);
    res.status(200).json(MasterAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterAnnouncement) {
      return res.status(404).json({ message: "Announcement Tidak ada" });
    }

    const updatedMasterAnnouncement = await Announcement.findById(id);
    res.status(200).json(updatedMasterAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnnouncement,
  getAnnouncementByKategori,
  getAnnouncementPrefix,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
};
