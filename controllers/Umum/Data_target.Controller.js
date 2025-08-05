const DataTarget = require("../../models/Umum/Data_target.Models");


// GET BY DOMAIN
const getDataTarget = async (req, res) => {
  try {
    const { deleted } = req.params;
    const filter = {};
    if (deleted) filter.Data_target_status = deleted;
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET TOTAL TARGET PER BULAN BERDASARKAN TAHUN
const getDataTargetPerBulan = async (req, res) => {
  try {
    const { deleted } = req.params;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Parameter query 'year' wajib diisi." });
    }

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const matchStatus = {};
    if (deleted) {
      matchStatus.Data_target_status = deleted;
    }

    const result = await DataTarget.aggregate([
      {
        // Konversi string ke date
        $addFields: {
          createdDate: { $toDate: "$Data_target_created" }
        }
      },
      {
        // Filter berdasarkan tahun
        $match: {
          createdDate: {
            $gte: start,
            $lt: end
          },
          ...matchStatus
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

    result.forEach((item) => {
      const monthIndex = item._id.month - 1;
      value[monthIndex] = item.total;
    });

    res.status(200).json({ label: labels, value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TOTAL TARGET PER RANGE BULAN BERDASARKAN BULAN DAN RANGE
const getDataTargetPerRangeBulan = async (req, res) => {
  try {
    const { deleted } = req.params;
    const { month, range } = req.query;

    if (!month || !range) {
      return res.status(400).json({ message: "Parameter 'month' dan 'range' wajib diisi." });
    }

    const inputDate = new Date(`${month}-01`);
    const rangeInt = parseInt(range);
    const totalGroups = 6;
    const monthsPerGroup = rangeInt;

    const matchStatus = {};
    if (deleted) {
      matchStatus.Data_target_status = deleted;
    }

    // Generate 6 grup bulan berdasarkan range
    const groups = Array.from({ length: totalGroups }, (_, i) => {
      const start = new Date(inputDate);
      start.setMonth(start.getMonth() - ((totalGroups - 1 - i) * monthsPerGroup));

      const end = new Date(start);
      end.setMonth(end.getMonth() + monthsPerGroup); // eksklusif

      const lastMonth = new Date(end);
      lastMonth.setMonth(end.getMonth() - 1); // bulan terakhir yang termasuk

      const label = `${start.toLocaleString('default', { month: 'short' })} ${start.getFullYear()} - ${lastMonth.toLocaleString('default', { month: 'short' })} ${lastMonth.getFullYear()}`;

      return {
        label,
        start,
        end
      };
    });


    // Ambil data yang berada dalam rentang seluruh grup
    const earliestDate = groups[0].start;
    const latestDate = groups[groups.length - 1].end;

    const rawData = await DataTarget.aggregate([
      {
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: "$Data_target_created",
              format: "%Y-%m-%d"
            }
          }
        }
      },
      {
        $match: {
          createdDate: { $gte: earliestDate, $lt: latestDate },
          ...matchStatus
        }
      },
      {
        $project: {
          createdDate: 1
        }
      }
    ]);

    // Hitung total data per grup
    const values = groups.map(g => {
      const total = rawData.filter(d =>
        d.createdDate >= g.start && d.createdDate < g.end
      ).length;
      return total;
    });

    const labels = groups.map(g => g.label);

    res.status(200).json({ label: labels, value: values });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getDataTargetById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterDataTarget = await DataTarget.findById(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY NAME 
const getDataTargetBySalesId = async (req,res) =>{
  try {
    const { id } = req.params;
    const filter = { "Data_target_detail.Data_target_detail_id": id };
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createDataTarget = async (req, res) => {
  try {
    const MasterDataTarget = await DataTarget.create(req.body);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated MasterItem
const updateDataTarget = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterDataTarget = await DataTarget.findByIdAndUpdate(
      id,
      req.body
    );

    if (!MasterDataTarget) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterDataTarget = await DataTarget.findById(id);
    res.status(200).json(updatedMasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------

module.exports = {
  getDataTarget,
  getDataTargetPerBulan,
  getDataTargetPerRangeBulan,
  getDataTargetById,
  getDataTargetBySalesId,
  createDataTarget,
  updateDataTarget,
};
