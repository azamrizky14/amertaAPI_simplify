const TrTask = require("../../models/Koordinator/Tr_Task.Model");

const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getTrTask = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain };
    if (deleted) filter.Tr_task_status = deleted;
    const MasterTrTask = await TrTask.find(filter);
    res.status(200).json(MasterTrTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BY DIVISI
const getTrTaskByDivisi = async (req, res) => {
  try {
    const { domain, hierarchy, division, deleted } = req.params;
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);
    const filter = { companyCode: newDomain, Tr_task_divisi: division };
    if (deleted) filter.Tr_task_status = deleted;
    const MasterTrTask = await TrTask.find(filter);
    res.status(200).json(MasterTrTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrTaskByTeknisi = async (req, res) => {
  try {
    const { domain, hierarchy, name, deleted } = req.params;

    // Validasi awal
    if (!domain || !hierarchy || !name) {
      return res
        .status(400)
        .json({ message: "Parameter Tidak ada : domain, hierarchy, or name" });
    }

    // Dapatkan company code dari helper
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2);

    // Bangun query filter
    const match = { Tr_task_pic_nama: name }; // hanya name yang kamu filtering

    const filter = {
      companyCode: newDomain,
      Tr_task_pic: { $elemMatch: match },
    };

    if (deleted) {
      filter.Tr_task_status = deleted;
    }

    // Eksekusi query
    const MasterTrTask = await TrTask.find(filter).lean();
    const result = MasterTrTask.flatMap((task) =>
      task.Tr_task_list.map((item) => ({
        ...item,
        Tr_task_id: task.Tr_task_id,
        Tr_task_created: task.Tr_task_created,
        Tr_task_divisi: task.Tr_task_divisi,
      }))
    );
    // for (let i = 0; i < MasterTrTask.length; i++) {
    //   // const element = array[MasterTrTask];
    //   // index
    //   return res.status(200).json(MasterTrTask[i].Tr_task_list)
    // }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getTaskPrefix = async (req, res) => {
  try {
    const { type, date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `${type}-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await TrTask.find({
      Tr_task_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_task_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Tr_task_id : maxId;
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
const getTrTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterTrTask = await TrTask.findById(filter);
    res.status(200).json(MasterTrTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrTaskPekerjaanByTrTask = async (req, res) => {
  try {
    const { job } = req.params;
    const filter = { Tr_task_id: job };
    const MasterTrTask = await TrTask.findOne(filter);
    res.status(200).json(MasterTrTask.Tr_task_list);
    // res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createTrTask = async (req, res) => {
  try {
    const MasterTrTask = await TrTask.create(req.body);
    res.status(200).json(MasterTrTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateTrTask = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterTrTask = await TrTask.findByIdAndUpdate(id, req.body);

    if (!MasterTrTask) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterTrTask = await TrTask.findById(id);
    res.status(200).json(updatedMasterTrTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrTask,
  getTrTaskByDivisi,
  getTrTaskByTeknisi,
  getTrTaskPekerjaanByTrTask,
  getTrTaskById,
  createTrTask,
  updateTrTask,
  getTaskPrefix,
};
