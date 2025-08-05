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

const getAnnualLeadCreated = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: "Parameter 'year' wajib diisi." });

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const result = await DataLead.aggregate([
      {
        $match: {
          Data_lead_created: { $regex: /^\d{4}-\d{2}-\d{2}$/, $ne: "NaT" }
        }
      },
      {
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: "$Data_lead_created",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          createdDate: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdDate" } },
          total: { $sum: 1 }
        }
      }
    ]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const value = Array(12).fill(0);
    result.forEach(r => value[r._id.month - 1] = r.total);

    res.status(200).json({ label: labels, value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRangeLeadCreated = async (req, res) => {
  try {
    const { month, range } = req.query;
    if (!month || !range) return res.status(400).json({ message: "Parameter 'month' dan 'range' wajib diisi." });

    const inputDate = new Date(`${month}-01`);
    const rangeInt = parseInt(range);
    const totalGroups = 6;

    const groups = Array.from({ length: totalGroups }, (_, i) => {
      const start = new Date(inputDate);
      start.setMonth(start.getMonth() - ((totalGroups - 1 - i) * rangeInt));
      const end = new Date(start);
      end.setMonth(end.getMonth() + rangeInt);

      const endLabel = new Date(end);
      endLabel.setDate(0);

      const label = `${start.toLocaleString("default", { month: "short" })} ${start.getFullYear()} - ${endLabel.toLocaleString("default", { month: "short" })} ${endLabel.getFullYear()}`;
      return { start, end, label };
    });

    const earliestDate = groups[0].start;
    const latestDate = groups[groups.length - 1].end;

    const rawData = await DataLead.aggregate([
      {
        $match: {
          Data_lead_created: { $regex: /^\d{4}-\d{2}-\d{2}$/, $ne: "NaT" }
        }
      },
      {
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: "$Data_lead_created",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          createdDate: { $gte: earliestDate, $lt: latestDate }
        }
      },
      {
        $project: {
          createdDate: 1
        }
      }
    ]);

    const values = groups.map(({ start, end }) =>
      rawData.filter(x => x.createdDate >= start && x.createdDate < end).length
    );

    const labels = groups.map(g => g.label);

    res.status(200).json({ label: labels, value: values });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnualLeadVisit = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: "Parameter 'year' wajib diisi." });

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const result = await DataLead.aggregate([
      { $unwind: "$Data_lead_kunjungan" },
      {
        $match: {
          "Data_lead_kunjungan.Data_lead_kunjungan_tanggal": {
            $regex: /^\d{4}-\d{2}-\d{2}$/, // pastikan format YYYY-MM-DD
            $ne: "NaT" // hindari nilai 'NaT'
          }
        }
      },
      {
        $addFields: {
          kunjunganDate: {
            $dateFromString: {
              dateString: "$Data_lead_kunjungan.Data_lead_kunjungan_tanggal",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          kunjunganDate: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$kunjunganDate" } },
          total: { $sum: 1 }
        }
      }
    ]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const value = Array(12).fill(0);
    result.forEach((r) => value[r._id.month - 1] = r.total);

    res.status(200).json({ label: labels, value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRangeLeadVisit = async (req, res) => {
  try {
    const { month, range } = req.query;
    if (!month || !range) return res.status(400).json({ message: "Parameter 'month' dan 'range' wajib diisi." });

    const inputDate = new Date(`${month}-01`);
    const rangeInt = parseInt(range);
    const totalGroups = 6;

    const groups = Array.from({ length: totalGroups }, (_, i) => {
      const start = new Date(inputDate);
      start.setMonth(start.getMonth() - ((totalGroups - 1 - i) * rangeInt));
      const end = new Date(start);
      end.setMonth(end.getMonth() + rangeInt);

      const endLabel = new Date(end);
      endLabel.setDate(0);

      const label = `${start.toLocaleString("default", { month: "short" })} ${start.getFullYear()} - ${endLabel.toLocaleString("default", { month: "short" })} ${endLabel.getFullYear()}`;
      return { start, end, label };
    });

    const earliestDate = groups[0].start;
    const latestDate = groups[groups.length - 1].end;

    const rawData = await DataLead.aggregate([
      { $unwind: "$Data_lead_kunjungan" },
      {
        $match: {
          "Data_lead_kunjungan.Data_lead_kunjungan_tanggal": {
            $regex: /^\d{4}-\d{2}-\d{2}$/, // valid format
            $ne: "NaT"
          }
        }
      },
      {
        $addFields: {
          kunjunganDate: {
            $dateFromString: {
              dateString: "$Data_lead_kunjungan.Data_lead_kunjungan_tanggal",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          kunjunganDate: { $gte: earliestDate, $lt: latestDate }
        }
      },
      {
        $project: {
          kunjunganDate: 1
        }
      }
    ]);

    const values = groups.map(({ start, end }) =>
      rawData.filter(x => x.kunjunganDate >= start && x.kunjunganDate < end).length
    );

    const labels = groups.map(g => g.label);

    res.status(200).json({ label: labels, value: values });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnualClosedByLastUpdated = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: "Parameter 'year' wajib diisi." });

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const result = await DataLead.aggregate([
      {
        $match: {
          Data_lead_status_lead: "Closed",
          "Data_lead_updated.0": { $exists: true }
        }
      },
      {
        $addFields: {
          lastUpdated: {
            $arrayElemAt: ["$Data_lead_updated", -1]
          }
        }
      },
      {
        $addFields: {
          updatedDate: {
            $dateFromString: {
              dateString: "$lastUpdated.Data_lead_updated_tanggal",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          updatedDate: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$updatedDate" } },
          total: { $sum: 1 }
        }
      }
    ]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const value = Array(12).fill(0);
    result.forEach(r => value[r._id.month - 1] = r.total);

    res.status(200).json({ label: labels, value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRangeClosedByLastUpdated = async (req, res) => {
  try {
    const { month, range } = req.query;
    if (!month || !range) return res.status(400).json({ message: "Parameter 'month' dan 'range' wajib diisi." });

    const inputDate = new Date(`${month}-01`);
    const rangeInt = parseInt(range);
    const totalGroups = 6;

    const groups = Array.from({ length: totalGroups }, (_, i) => {
      const start = new Date(inputDate);
      start.setMonth(start.getMonth() - ((totalGroups - 1 - i) * rangeInt));
      const end = new Date(start);
      end.setMonth(end.getMonth() + rangeInt);

      const endLabel = new Date(end);
      endLabel.setDate(0);

      const label = `${start.toLocaleString("default", { month: "short" })} ${start.getFullYear()} - ${endLabel.toLocaleString("default", { month: "short" })} ${endLabel.getFullYear()}`;
      return { start, end, label };
    });

    const earliestDate = groups[0].start;
    const latestDate = groups[groups.length - 1].end;

    const rawData = await DataLead.aggregate([
      {
        $match: {
          Data_lead_status_lead: "Closed",
          "Data_lead_updated.0": { $exists: true }
        }
      },
      {
        $addFields: {
          lastUpdated: {
            $arrayElemAt: ["$Data_lead_updated", -1]
          }
        }
      },
      {
        $addFields: {
          updatedDate: {
            $dateFromString: {
              dateString: "$lastUpdated.Data_lead_updated_tanggal",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          updatedDate: { $gte: earliestDate, $lt: latestDate }
        }
      },
      {
        $project: {
          updatedDate: 1
        }
      }
    ]);

    const values = groups.map(({ start, end }) =>
      rawData.filter(x => x.updatedDate >= start && x.updatedDate < end).length
    );

    const labels = groups.map(g => g.label);

    res.status(200).json({ label: labels, value: values });
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
    
    const { afiliasi, year } = req.query;
    const filter = {};

    if (afiliasi) {
      filter.Data_lead_afiliasi = afiliasi
    }

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
    
    const { afiliasi, year } = req.query;
    const filter = {};

    if (afiliasi) {
      filter.Data_lead_afiliasi = afiliasi
    }

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
getAnnualLeadCreated,
  getRangeLeadCreated,
  getAnnualLeadVisit,
  getRangeLeadVisit,
  getAnnualClosedByLastUpdated,
  getRangeClosedByLastUpdated,
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
