const Tr_po = require("../models/Tr_po.model");
const mongoose = require("mongoose");

// GET BY DOMAIN
const getTrPo = async (req, res) => {
  try {
    const { domain, deleted, status } = req.params;

    // Create a filter object dynamically
    const filter = { Tr_po_domain: domain };

    // Add optional filters if provided
    if (deleted) filter.Tr_po_deleted = deleted;
    if (status) filter.Tr_po_status = status;

    // Fetch the data based on the dynamic filter
    const TrPo = await Tr_po.find(filter).lean();

    // Remove `lokasi_detail` from the response
    const filteredData = TrPo.map((location) => {
      const { Tr_po_item, ...rest } = location; // Destructure and exclude `lokasi_detail`
      return rest;
    });

    // Check if any data was found
    if (filteredData.length > 0) {
      const reversedData = filteredData.reverse();
      return res.status(200).json(reversedData);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getTrPoEvident = async (req, res) => {
  try {
    const { domain, deleted, type, status, createdStart, createdEnd } = req.params;

    // Create a filter object dynamically
    const filter = { Tr_po_domain: domain };

    // Add optional filters if provided
    if (deleted) filter.Tr_po_deleted = deleted;
    if (type) filter.Tr_po_jenis = type;
    if (status) filter.Tr_po_status = status;

    // Add filter for Tr_po_created if start and/or end dates are provided
    if (createdStart || createdEnd) {
      filter.Tr_po_created = {};
      if (createdStart) filter.Tr_po_created.$gte = new Date(createdStart);
      if (createdEnd) filter.Tr_po_created.$lte = new Date(createdEnd);
    }

    // Fetch the data based on the dynamic filter and sort by Tr_po_created
    const TrPo = await Tr_po.find(filter).sort({ Tr_po_created: -1 }); // Sort by newest date

    // Check if any data was found
    if (TrPo.length > 0) {
      // Use flatMap to combine all Tr_po_work_order_terpakai into a single array
      const combinedResult = TrPo.flatMap(
        (item) => item.Tr_po_work_order_terpakai || []
      );

      // const reversedData = combinedResult.reverse();
      // Sort the combinedResult by Tr_po_created (newest to latest)
      const sortedResult = combinedResult.sort((a, b) => {
        const dateA = new Date(a.Tr_po_created);
        const dateB = new Date(b.Tr_po_created);
        return dateB - dateA; // Sort descending
      });

      return res.status(200).json(sortedResult);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getTrPoById = async (req, res) => {
  try {
    const { id } = req.params;
    const TrPo = await Tr_po.findById(id);
    res.status(200).json(TrPo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrPo = async (req, res) => {
  try {
    const TrPo = await Tr_po.create(req.body);
    res.status(200).json(TrPo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik
const updateTrPo = async (req, res) => {
  try {
    const { id } = req.params;

    const TrPo = await Tr_po.findByIdAndUpdate(id, req.body);

    if (!TrPo) {
      return res.status(404).json({ message: "TrPo not found" });
    }

    const updatedTrPo = await Tr_po.findById(id);
    res.status(200).json(updatedTrPo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX

const getPoPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, '')
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `PO-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await Tr_po.find({
      Tr_po_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_po_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber
        ? currentItem.Tr_po_id
        : maxId;
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

module.exports = {
  getTrPo,
  getTrPoEvident,
  getTrPoById,
  createTrPo,
  updateTrPo,
  getPoPrefix,
};
