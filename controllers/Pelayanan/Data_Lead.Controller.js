const DataLead = require("../../models/Pelayanan/Data_lead.Model");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getDataLead = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.3);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Data_lead_status = deleted;
    const MasterDataLead = await DataLead.find(filter);
    res.status(200).json(MasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY USER ACCESS ARRAY
const getDataLeadByUserAccess = async (req, res) => {
  try {
    const { access } = req.query;
    const filter = {};
    if (access) {
      filter["Data_lead_access.Data_lead_access_user"] = access;
    }
    const result = await DataLead.find(filter);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FLATTENED KUNJUNGAN BY USER ACCESS
const getFlattenedKunjunganByUserAccess = async (req, res) => {
  try {
    const { access = "", date, month, type } = req.query;

    const matchConditions = [];

    // Kalau ada access dan bukan string kosong
    if (access && access.trim() !== "") {
      matchConditions.push({
        "Data_lead_kunjungan.Data_lead_kunjungan_user": access
      });
    }

    const kunjunganFilter = [];

    // Tambahkan filter access jika ada
    if (access && access.trim() !== "") {
      kunjunganFilter.push({
        $eq: ["$$kunjungan.Data_lead_kunjungan_user", access]
      });
    }

    // Filter berdasarkan tanggal
    if (date) {
      kunjunganFilter.push({
        $eq: ["$$kunjungan.Data_lead_kunjungan_tanggal", date]
      });
    }

    // Filter berdasarkan bulan
    if (month) {
      kunjunganFilter.push({
        $eq: [
          { $substr: ["$$kunjungan.Data_lead_kunjungan_tanggal", 0, 7] },
          month
        ]
      });
    }

    const pipeline = [
      ...(matchConditions.length > 0 ? [{ $match: { $and: matchConditions } }] : []),
      {
        $project: {
          Data_lead_nama: 1,
          Data_lead_phone: 1,
          filteredKunjungan: {
            $filter: {
              input: "$Data_lead_kunjungan",
              as: "kunjungan",
              cond: kunjunganFilter.length > 0 ? { $and: kunjunganFilter } : {}, // ambil semua kalau kosong
            },
          },
        },
      },
      { $unwind: "$filteredKunjungan" },
      {
        $project: {
          leadId: "$_id",
          leadNama: "$Data_lead_nama",
          leadPhone: "$Data_lead_phone",
          kunjunganTanggal: "$filteredKunjungan.Data_lead_kunjungan_tanggal",
          kunjunganRespons: "$filteredKunjungan.Data_lead_kunjungan_respons",
          kunjunganKeterangan: "$filteredKunjungan.Data_lead_kunjungan_keterangan",
          kunjunganEvident: "$filteredKunjungan.Data_lead_kunjungan_evident",
          kunjunganTimestamp: "$filteredKunjungan.Data_lead_kunjungan_timestamp",
          kunjunganUser: "$filteredKunjungan.Data_lead_kunjungan_user",
        },
      },
    ];

    const results = await DataLead.aggregate(pipeline);

    if (type === "total") {
      return res.status(200).json({ total: results.length });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY statuslead
const getDataLeadBystatuslead = async (req, res) => {
  try {
    const { domain, hierarchy, statuslead, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.3);
    const filter = {
      companyCode: newDomain,
      Data_lead_status_lead: statuslead,
    };
    if (deleted) filter.Data_lead_status = deleted;
    const MasterDataLead = await DataLead.find(filter);
    res.status(200).json(MasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY created
const getDataLeadByAfiliasi = async (req, res) => {
  try {
    const { afiliasi } = req.params;
    const filter = { Data_lead_afiliasi: afiliasi };
    const MasterDataLead = await DataLead.find(filter);
    res.status(200).json(MasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countDataLeadByAfiliasi = async (req, res) => {
  try {
    const { afiliasi } = req.params;
    const filter = { Data_lead_afiliasi: afiliasi };
    const MasterDataLead = await DataLead.find(filter);
    res.status(200).json(MasterDataLead.length);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Count By Month
const countDataLeadByMonth = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const { year } = req.query;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.3);
    const filter = { companyCode: newDomain };
    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Data_lead_created", 0, 7] }, year],
      };
    }

    if (deleted) {
      filter.Data_lead_status = deleted;
    }

    // Dapatkan data
    const MasterDataLead = await DataLead.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: MasterDataLead.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const countDataLeadByDate = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const { year } = req.query;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1.3);
    const filter = { companyCode: newDomain };
    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Data_lead_created", 0, 10] }, year],
      };
    }

    if (deleted) {
      filter.Data_lead_status = deleted;
    }

    // Dapatkan data
    const MasterDataLead = await DataLead.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: MasterDataLead.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countDataLeadByAfiliasiandMonth = async (req, res) => {
  try {
    const { afiliasi } = req.params;
    const { year } = req.query;
    const filter = { Data_lead_afiliasi: afiliasi };

    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Data_lead_created", 0, 7] }, year],
      };
    }

    // Dapatkan data
    const MasterDataLead = await DataLead.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: MasterDataLead.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countDataLeadByAfiliasiandDate = async (req, res) => {
  try {
    const { afiliasi } = req.params;
    const { year } = req.query;
    const filter = { Data_lead_afiliasi: afiliasi };

    // Jika filter tahun diberikan
    if (year) {
      // Asumsikan Data_lead_created dalam format "YYYY-MM-DD"
      filter.$expr = {
        $eq: [{ $substr: ["$Data_lead_created", 0, 10] }, year],
      };
    }

    // Dapatkan data
    const MasterDataLead = await DataLead.find(filter);

    // Kirim jumlah hasil
    res.status(200).json({ count: MasterDataLead.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getDataLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterDataLead = await DataLead.findById(filter);
    res.status(200).json(MasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getDataLeadPrefix = async (req, res) => {
  try {
    const { type, date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `${type}-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await DataLead.find({
      Data_lead_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Data_lead_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Data_lead_id : maxId;
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
const createDataLead = async (req, res) => {
  try {
    const MasterDataLead = await DataLead.create(req.body);
    res.status(200).json(MasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateDataLead = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterDataLead = await DataLead.findByIdAndUpdate(id, req.body);

    if (!MasterDataLead) {
      return res.status(404).json({ message: "DataLead not found" });
    }

    const updatedMasterDataLead = await DataLead.findById(id);
    res.status(200).json(updatedMasterDataLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDataLead,
  getDataLeadByUserAccess,
  getFlattenedKunjunganByUserAccess,
  getDataLeadBystatuslead,
  getDataLeadByAfiliasi,
  countDataLeadByAfiliasi,
  countDataLeadByMonth,
  countDataLeadByDate,
  countDataLeadByAfiliasiandMonth,
  countDataLeadByAfiliasiandDate,
  getDataLeadPrefix,
  getDataLeadById,
  getDataLeadPrefix,
  createDataLead,
  updateDataLead,
};
