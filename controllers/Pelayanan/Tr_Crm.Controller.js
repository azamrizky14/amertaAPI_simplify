const TrCrm = require("../../models/Pelayanan/Tr_Crm.Model");


const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getTrCrm = async (req, res) => {
    try {
        const { domain, hierarchy, deleted } = req.params;
        const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2)
        const filter = { companyCode: newDomain };
        if (deleted) filter.Tr_crm_status = deleted;
        const MasterTrCrm = await TrCrm.find(filter);
        res.status(200).json(MasterTrCrm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET BY KATEGORI 
const getTrCrmByKategori = async (req, res) => {
    try {
        const { domain, hierarchy, kategori, deleted } = req.params;
        const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2)
        const filter = { companyCode: newDomain, Tr_crm_kategori: kategori };
        if (deleted) filter.Tr_crm_status = deleted;
        const MasterTrCrm = await TrCrm.find(filter);
        res.status(200).json(MasterTrCrm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// FIND ONE BY ID
const getTrCrmById = async (req, res) => {
    try {
        const { id } = req.params;
        const filter = { _id: id }
        const MasterTrCrm = await TrCrm.findById(filter);
        res.status(200).json(MasterTrCrm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET BON PREFIX
const getTrCrmPrefix = async (req, res) => {
    try {
        const { type, date } = req.params;

        const newDate = date.replace(/-/g, "");
        // Buat prefix berdasarkan parameter `type` dan `date`
        const prefix = `${type}-${newDate}`;

        // Cari semua dokumen yang memiliki prefix sesuai di database
        const data = await TrCrm.find({
            Tr_crm_id: { $regex: `^${prefix}` },
        });

        // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
        if (data.length === 0) {
            return res.json({ nextId: `${prefix}-001` });
        }

        // Cari ID dengan angka terbesar dari hasil query
        const latestId = data.reduce((maxId, currentItem) => {
            const currentNumber = parseInt(
                currentItem.Tr_crm_id.split("-").pop() || "0"
            );
            const maxNumber = parseInt(maxId.split("-").pop() || "0");
            return currentNumber > maxNumber ? currentItem.Tr_crm_id : maxId;
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

const countTrCrmByMonth = async (req,res) =>{
    try {
    const { domain, hierarchy, deleted } = req.params;
    const { year } = req.query;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.2);
    const filter = { companyCode: newDomain };
    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Tr_crm_created", 0, 7] }, year],
      };
    }

    if (deleted) {
      filter.Tr_crm_status = deleted;
    }

    // Dapatkan data
    const DataCRM = await TrCrm.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: DataCRM.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countTrCrmByDate = async(req,res) =>{
    try {
    const { domain, hierarchy, deleted } = req.params;
    const { year } = req.query;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.2);
    const filter = { companyCode: newDomain };
    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Tr_crm_created", 0, 10] }, year],
      };
    }

    if (deleted) {
      filter.Tr_crm_status = deleted;
    }

    // Dapatkan data
    const DataCRM = await TrCrm.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: DataCRM.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE 
const createTrCrm = async (req, res) => {
    try {
        const MasterTrCrm = await TrCrm.create(req.body);
        res.status(200).json(MasterTrCrm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update 
const updateTrCrm = async (req, res) => {
    try {
        const { id } = req.params;

        const MasterTrCrm = await TrCrm.findByIdAndUpdate(id, req.body);

        if (!MasterTrCrm) {
            return res.status(404).json({ message: "TrCrm not found" });
        }

        const updatedMasterTrCrm = await TrCrm.findById(id);
        res.status(200).json(updatedMasterTrCrm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getTrCrm,
    getTrCrmByKategori,
    getTrCrmPrefix,
    getTrCrmById,
    getTrCrmPrefix,
    countTrCrmByMonth,
    countTrCrmByDate,
    createTrCrm,
    updateTrCrm,
};
