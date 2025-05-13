const mongoose = require("mongoose");
const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// ALL MODEL
const Tr_po = require("../../models/Logistik/Tr_PurchaseOrder.Model");
const Tr_pp = require("../../models/Logistik/Tr_PurchasePayment.Model");
const Tr_qa = require("../../models/Logistik/Tr_Qa.Model");
const Tr_gr = require("../../models/Logistik/Tr_GoodReceipt.Model");

// GET BY DOMAIN
const getTrPo = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

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
// GET PO EVIDENT
const getTrPoEvident = async (req, res) => {
  try {
    const {
      domain,
      hierarchy,
      deleted,
      type,
      status,
      createdStart,
      createdEnd,
    } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

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
// FIND ONE BY ID
const getTrPoByPO = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Tr_po.findOne({ Tr_po_id: id });
    res.status(200).json(data);
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
// Updated Logistik
const updateTrPoByPO = async (req, res) => {
  try {
    const { id } = req.params;

    const TrPo = await Tr_po.findOneAndUpdate({ Tr_po_id: id }, req.body);

    if (!TrPo) {
      return res.status(404).json({ message: "TrPo not found" });
    }

    const updatedTrPo = await Tr_po.findOne({ Tr_po_id: id });
    res.status(200).json(updatedTrPo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BON PREFIX
const getPoPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, "");
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
      return currentNumber > maxNumber ? currentItem.Tr_po_id : maxId;
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

// PO Controller

// GET ALL
const getTrPpAll = async (req, res) => {
  try {
    const { deleted, status } = req.params;

    // Create a filter object dynamically
    const filter = {};

    // Add optional filters if provided
    if (deleted) filter.Tr_pp_deleted = deleted;
    if (status) filter.Tr_pp_status = status;

    // Fetch the data based on the dynamic filter
    const TrPp = await Tr_pp.find(filter).lean();

    // Check if any data was found
    if (TrPp.length > 0) {
      const reversedData = TrPp.reverse();
      return res.status(200).json(reversedData);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getTrPpById = async (req, res) => {
  try {
    const { id } = req.params;
    let TrPp = await Tr_pp.findById(id);

    if (TrPp) {
      // Konversi menjadi objek biasa agar bisa dimodifikasi
      TrPp = TrPp.toObject();

      if (TrPp.Tr_po_id) {
        // Cari data PO berdasarkan Tr_po_id
        const data = await Tr_po.findOne({ Tr_po_id: TrPp.Tr_po_id });

        if (data) {
          TrPp.Tr_po_item = data.Tr_po_item; // Sekarang bisa dimodifikasi
          TrPp.Tr_pp_item = data.Tr_pp_item; // Sekarang bisa dimodifikasi
        }
      }
    }
    res.status(200).json(TrPp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY DOMAIN
const getTrPp = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_pp_deleted = deleted;
    if (status) filter.Tr_pp_status = status;

    // Fetch the data based on the dynamic filter
    const TrPp = await Tr_pp.find(filter).lean();

    // Remove `lokasi_detail` from the response
    const filteredData = TrPp.map((location) => {
      const { Tr_pp_item, ...rest } = location; // Destructure and exclude `lokasi_detail`
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

// CREATE
const createTrPp = async (req, res) => {
  try {
    const TrPp = await Tr_pp.create(req.body);
    res.status(200).json(TrPp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik
const updateTrPp = async (req, res) => {
  try {
    const { id } = req.params;

    const TrPp = await Tr_pp.findByIdAndUpdate(id, req.body);

    if (!TrPp) {
      return res.status(404).json({ message: "TrPp not found" });
    }

    const updatedTrPp = await Tr_pp.findById(id);
    res.status(200).json(updatedTrPp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrPpWithImage = async (req, res) => {
  try {
    const ppId = req.params.id;
    let data = req.body;

    // Ambil user berdasarkan ID
    const TrPp = await Tr_pp.findOne({ Tr_pp_id: ppId });
    if (!TrPp) {
      return res.status(404).json({ message: "TrPp not found" });
    }

    // Jika ada file yang diunggah, simpan datanya
    if (req.file) {
      TrPp.Tr_pp_image = req.file.filename
    }
    // Update semua field lainnya dari `data`
    Object.assign(TrPp, data);

    // Simpan perubahan (Mongoose otomatis meningkatkan __v)
    await TrPp.save();

    res.status(200).json(TrPp);
  } catch (error) {
    console.error("Error updating TrPp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// GET BON PREFIX
const getPpPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `PP-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await Tr_pp.find({
      Tr_pp_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_pp_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Tr_pp_id : maxId;
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


// GET BY DOMAIN
const getTrGr = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status, qa } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_gr_deleted = deleted;
    if (status) filter.Tr_gr_status = status;
    if (qa) filter.Tr_gr_qa_status = status;
    // Fetch the data based on the dynamic filter
    const TrGr = await Tr_gr.find(filter).lean();

    // Remove `lokasi_detail` from the response
    const filteredData = TrGr.map((location) => {
      const { Tr_gr_item, ...rest } = location; // Destructure and exclude `lokasi_detail`
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
// GET TR List For GR
const getTrPoListForGr = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_po_deleted = deleted;
    if (status) filter.Tr_po_status = status;

    // Add filter to check if at least one item_jumlah_gr > 0
    filter.Tr_pp_item = {
      $elemMatch: {
        item_jumlah_gr: { $gt: 0 },
      },
    };
    filter.Tr_po_shipment = { $ne: {} };

    // Fetch the data based on the dynamic filter
    const TrGr = await Tr_po.find(filter).lean();

    // Remove `lokasi_detail` from the response
    const filteredData = TrGr.map((location) => {
      const { Tr_gr_item, ...rest } = location; // Destructure and exclude `lokasi_detail`
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

// GET BON PREFIX
const getGrPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `GR-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await Tr_gr.find({
      Tr_gr_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_gr_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Tr_gr_id : maxId;
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
const getTrGrById = async (req, res) => {
  try {
    const { id } = req.params;
    let TrGr = await Tr_gr.findById(id);

    res.status(200).json(TrGr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createTrGr = async (req, res) => {
  try {
    const TrGr = await Tr_gr.create(req.body);
    res.status(200).json(TrGr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrGrWithImage = async (req, res) => {
  try {
    const data = req.body
    data.Tr_gr_item = JSON.parse(data.Tr_gr_item)
    data.companyCode = JSON.parse(data.companyCode)
    
    // Jika ada file yang diunggah, simpan datanya
    if (req.file) {
      data.Tr_gr_image = req.file.filename
    }
    const TrGr = await Tr_gr.create(req.body);
    res.status(200).json(TrGr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik
const updateTrGr = async (req, res) => {
  try {
    const { id } = req.params;

    const TrGr = await Tr_gr.findByIdAndUpdate(id, req.body);

    if (!TrGr) {
      return res.status(404).json({ message: "TrGr not found" });
    }

    const updatedTrGr = await Tr_gr.findById(id);
    res.status(200).json(updatedTrGr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrGrWithImage = async (req, res) => {
  try {
    const grId = req.params.id;
    let data = req.body;

    // Ambil user berdasarkan ID
    const TrGr = await Tr_pp.findOne({ Tr_gr_id: grId });
    if (!TrGr) {
      return res.status(404).json({ message: "TrGr not found" });
    }

    // Jika ada file yang diunggah, simpan datanya
    if (req.file) {
      TrGr.Tr_pp_image = req.file.filename
    }
    // Update semua field lainnya dari `data`
    Object.assign(TrGr, data);

    // Simpan perubahan (Mongoose otomatis meningkatkan __v)
    await TrGr.save();

    res.status(200).json(TrGr);
  } catch (error) {
    console.error("Error updating TrGr:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Updated Logistik
const updateTrGrByGR = async (req, res) => {
  try {
    const { id } = req.params;

    const TrGr = await Tr_gr.findOneAndUpdate({ Tr_gr_id: id }, req.body);

    if (!TrGr) {
      return res.status(404).json({ message: "TrGr not found" });
    }

    const updatedTrGr = await Tr_gr.findOne({ Tr_gr_id: id });
    res.status(200).json(updatedTrGr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET BY DOMAIN
const getTrQa = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_qa_deleted = deleted;
    if (status) filter.Tr_qa_status = status;
    // Fetch the data based on the dynamic filter
    const TrGr = await Tr_qa.find(filter).lean();

    // Remove `lokasi_detail` from the response
    const filteredData = TrGr.map((location) => {
      const { Tr_qa_item, ...rest } = location; // Destructure and exclude `lokasi_detail`

      rest.totalLolos = Tr_qa_item.reduce((total, item) => {
        return total + Number(item.item_jumlah_lolos || 0);
      }, 0);
      rest.totalRusak = Tr_qa_item.reduce((total, item) => {
        return total + Number(item.item_jumlah_rusak || 0);
      }, 0);
      rest.totalRetur = Tr_qa_item.reduce((total, item) => {
        return total + Number(item.item_jumlah_retur || 0);
      }, 0);

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

const getTrGrListForQa = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, status } = req.params;

    // Ambil kode perusahaan berdasarkan hierarki dan domain
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    if (deleted) filter.Tr_gr_deleted = deleted;
    if (status) filter.Tr_gr_status = status;

    // Tambahkan filter tambahan
    filter.Tr_gr_qa_status = { $ne: "done" };

    // Ambil semua data GR berdasarkan filter
    const TrGr = await Tr_gr.find(filter).lean();

    // Ambil semua Tr_po_id unik dari TrGr
    const poIds = TrGr.map(gr => gr.Tr_po_id);

    // Ambil semua data PO yang terkait
    const TrPoList = await Tr_po.find({ Tr_po_id: { $in: poIds } }).lean();

    // Gabungkan Tr_pp_item ke setiap data GR
    const mergedData = TrGr.map(gr => {
      const relatedPo = TrPoList.find(po => po.Tr_po_id === gr.Tr_po_id);
      return {
        ...gr,
        Tr_pp_item: relatedPo?.Tr_pp_item || []
      };
    });

    if (mergedData.length > 0) {
      return res.status(200).json(mergedData.reverse()); // reverse kalau memang perlu
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getQaPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `QA-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await Tr_qa.find({
      Tr_qa_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_qa_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Tr_qa_id : maxId;
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
const getTrQaById = async (req, res) => {
  try {
    const { id } = req.params;
    let TrQa = await Tr_qa.findById(id);

    res.status(200).json(TrQa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrQa = async (req, res) => {
  try {
    const TrQa = await Tr_qa.create(req.body);
    res.status(200).json(TrQa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // PO
  getTrPo,
  getTrPoEvident,
  getTrPoById,
  getTrPoByPO,
  createTrPo,
  updateTrPo,
  updateTrPoByPO,
  getPoPrefix,

  // PP
  getTrPp,
  getTrPpAll,
  getTrPpById,
  updateTrPp,
  createTrPp,
  getPpPrefix,
  updateTrPpWithImage,

  // GR
  getTrGr,
  getTrPoListForGr,
  getGrPrefix,
  createTrGr,
  createTrGrWithImage,
  updateTrGr,
  updateTrGrByGR,
  updateTrGrWithImage,
  getTrGrById,

  // QA
  getTrQa,
  getTrQaById,
  getTrGrListForQa,
  getQaPrefix,
  createTrQa,
};
