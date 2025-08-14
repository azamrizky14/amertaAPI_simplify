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

// GET ALL BY MATCHDATE
const getDataTargetMatch = async (req, res) => {
  try {
    const { deleted, matchDate } = req.params;
    const filter = {
      Data_target_created: matchDate,
    };
    if (deleted) filter.Data_target_status = deleted;
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BY START & END DATE
const getDataTargetStartEndDate = async (req, res) => {
  try {
    const { deleted } = req.query;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: "Tanggal tidak valid" });
    }
    endDate.setDate(endDate.getDate() + 1);
    const filter = {
      $expr: {
        $and: [
          { $gte: [{ $toDate: "$Data_target_created" }, startDate] },
          { $lt: [{ $toDate: "$Data_target_created" }, endDate] },
        ],
      },
    };
    if (deleted !== undefined) {
      filter.Data_target_status = deleted;
    }
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PER BULAN
const getDataTargetPerBulan = async (req, res) => {
  try {
    const { deleted, year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const filter = {
      $expr: {
        $and: [
          { $gte: [{ $toDate: "$Data_target_created" }, startDate] },
          { $lt: [{ $toDate: "$Data_target_created" }, endDate] },
        ],
      },
    };
    if (deleted) filter.Data_target_status = deleted;
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PER RANGE BULAN
const getDataTargetPerRangeBulan = async (req, res) => {
  try {
    const { deleted, startYear, startMonth, endYear, endMonth } = req.params;
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth, 1);
    const filter = {
      $expr: {
        $and: [
          { $gte: [{ $toDate: "$Data_target_created" }, startDate] },
          { $lt: [{ $toDate: "$Data_target_created" }, endDate] },
        ],
      },
    };
    if (deleted) filter.Data_target_status = deleted;
    const MasterDataTarget = await DataTarget.find(filter);
    res.status(200).json(MasterDataTarget);
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

// FIND ONE BY SALES ID
const getDataTargetBySalesId = async (req, res) => {
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

// UPDATE
const updateDataTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterDataTarget = await DataTarget.findByIdAndUpdate(id, req.body);
    if (!MasterDataTarget) {
      return res.status(404).json({ message: "MasterItem not found" });
    }
    const updatedMasterDataTarget = await DataTarget.findById(id);
    res.status(200).json(updatedMasterDataTarget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDataTarget,
  getDataTargetMatch,
  getDataTargetStartEndDate,
  getDataTargetPerBulan,
  getDataTargetPerRangeBulan,
  getDataTargetById,
  getDataTargetBySalesId,
  createDataTarget,
  updateDataTarget,
};
