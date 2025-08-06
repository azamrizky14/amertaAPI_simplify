const Tr_teknis = require("../../models/Teknis/Tr_teknis.Model");
const mongoose = require("mongoose");
const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Folder tempat penyimpanan gambar (harus sama dengan Multer)
const uploadFolder = path.join(__dirname, "../images/admin_logistik");

// Pastikan folder penyimpanan ada
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const downloadImage = async (imageUrl) => {
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
      headers: {
        Accept: "image/*", // Pastikan server memahami permintaan sebagai gambar
      },
    });

    // Ambil ekstensi file dari URL atau gunakan .jpg sebagai default
    let fileExtension = path.extname(new URL(imageUrl).pathname);
        // Jika ekstensi kosong atau tidak valid, coba deteksi dari `content-type`
        if (!fileExtension || fileExtension === "") {
          const contentType = response.headers["content-type"];
          const extensionMap = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "image/svg+xml": ".svg",
          };
    
          fileExtension = extensionMap[contentType] || ".jpg"; // Default ke .jpg jika tidak dikenali
        }

    // Buat nama file sesuai format Multer
    const fileName = `${Date.now()}-TEKNIS-AMERTA-${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadFolder, fileName);

    // Simpan file yang diunduh
    fs.writeFileSync(filePath, response.data);

    return fileName; // Hanya kembalikan nama file untuk disimpan di database
  } catch (error) {
    console.error("Gagal mengunduh gambar:", imageUrl, error.message);
    return null; // Jika gagal, return null agar tidak menyimpan data yang salah
  }
};

// GET BY DOMAIN
const getTrTeknis = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, type, status } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1)
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_teknis_deleted = deleted;
    if (type) filter.Tr_teknis_jenis = type;
    if (status) filter.Tr_teknis_status = status;

    // Fetch the data based on the dynamic filter
    const TrTeknis = await Tr_teknis.find(filter);

    // Check if any data was found
    if (TrTeknis.length > 0) {
      const reversedData = TrTeknis.reverse();
      return res.status(200).json(reversedData);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getTrTeknisEvident = async (req, res) => {
  try {
    const { domain, deleted, type, status, hierarchy, createdStart, createdEnd } =
      req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1)
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.Tr_teknis_deleted = deleted;
    if (type) filter.Tr_teknis_jenis = type;
    if (status) filter.Tr_teknis_status = status;

    // Add filter for Tr_teknis_created if start and/or end dates are provided
    if (createdStart || createdEnd) {
      filter.Tr_teknis_created = {};
      if (createdStart) filter.Tr_teknis_created.$gte = new Date(createdStart);
      if (createdEnd) filter.Tr_teknis_created.$lte = new Date(createdEnd);
    }
    
    // Fetch the data based on the dynamic filter and sort by Tr_teknis_created
    const TrTeknis = await Tr_teknis.find(filter).sort({
      Tr_teknis_created: -1,
    }); // Sort by newest date

    // Check if any data was found
    if (TrTeknis.length > 0) {
      // Use flatMap to combine all Tr_teknis_work_order_terpakai into a single array
      const combinedResult = TrTeknis.flatMap(
        (item) => item.Tr_teknis_work_order_terpakai || []
      );

      // const reversedData = combinedResult.reverse();
      // Sort the combinedResult by Tr_teknis_created (newest to latest)
      const sortedResult = combinedResult.sort((a, b) => {
        const dateA = new Date(a.Tr_teknis_created);
        const dateB = new Date(b.Tr_teknis_created);
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

const getTrTeknisEvidentByMonth = async (req, res) => {
  try {
    const { domain, hierarchy, type, month, mode = "data" } = req.params;

    // Ambil companyCode dari helper
    const companyCode = await findByHierarchyAndDomain(hierarchy, domain, 1.1);

    // Buat query dasar
    const query = {
      companyCode,
      Tr_teknis_deleted: "N",
    };

    if (type) query.Tr_teknis_jenis = type;
    if ((type === 'PSB' || type === 'MT') && domain === '0,2') query.Tr_teknis_jenis = "PSN"

    // Ambil hanya field yang dibutuhkan
    const data = await Tr_teknis.find(
      query,
      "Tr_teknis_work_order_terpakai"
    );

    // Flatten semua work order yang ada
    const allWorkOrders = data.flatMap(item => item.Tr_teknis_work_order_terpakai || []);


    // Parse bulan untuk filter tanggal
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Filter berdasarkan tanggal dan jenis (jika ada)
    const filteredWorkOrders = allWorkOrders.filter(item => {
      const date = new Date(item.Tr_teknis_tanggal);
      const isInMonth = date >= startDate && date < endDate;
      const isTypeMatch = type ? item.Tr_teknis_kategori === type : true;
      return isInMonth && isTypeMatch;
    });

    // Output sesuai mode
    if (mode === "count") {
      return res.status(200).json({ total: filteredWorkOrders.length });
    } else {
      return res.status(200).json(filteredWorkOrders);
    }
  } catch (error) {
    console.error("Error fetching work order data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// const getAllWorkOrders = async (req, res) => {
//   try {
//     const { hierarchy, domain, type, month } = req.params;

//     let query = { Tr_teknis_deleted: "N" };
//     query.companyCode = await findByHierarchyAndDomain(hierarchy, domain, 1.1)

//     // Mengambil semua data Tr_teknis_work_order_terpakai
//     const orders = await Tr_teknis.find(
//       query,
//       "Tr_teknis_work_order_terpakai Tr_teknis_kategori Tr_teknis_tanggal"
//     );

//     // Meratakan array Tr_teknis_work_order_terpakai
//     const allWorkOrders = orders
//       .map((order) => order.Tr_teknis_work_order_terpakai)
//       .flat();

//     // Filter allWorkOrders berdasarkan type dan month
//     const startDate = new Date(`${month}-01T00:00:00Z`); // 1st day of the month
//     const endDate = new Date(startDate);
//     endDate.setMonth(startDate.getMonth() + 1); // 1st day of next month

//     const filteredWorkOrders = allWorkOrders.filter((order) => {
//       const orderDate = new Date(order.Tr_teknis_tanggal);
//       const isSameMonth = orderDate >= startDate && orderDate < endDate;
//       const isSameType = order.Tr_teknis_kategori === type;
//       return isSameMonth && isSameType;
//     });

//     // Mengirimkan hasil filter sebagai response JSON
//     res.status(200).json(filteredWorkOrders.length);
//   } catch (error) {
//     console.error("Error fetching work orders:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching work orders", error: error.message });
//   }
// };

const getAllWorkOrders = async (req, res) => {
  try {
    const { domain, hierarchy, type } = req.params;
    const { month, deleted, mode, startDate, endDate } = req.query;

    const companyCodes = await findByHierarchyAndDomain(hierarchy, domain, 1.1);

    // Siapkan kondisi awal
    const matchStage = {
      companyCode: companyCodes,
      ...(deleted && { Tr_teknis_deleted: deleted }),
    };

    const dateFilters = [];

    // ➤ Jika ada startDate dan endDate dari query
    if (startDate && endDate) {
      dateFilters.push(
        { $gte: ["$$item.Tr_teknis_tanggal", startDate] },
        { $lt: ["$$item.Tr_teknis_tanggal", endDate] }
      );
    }
    // ➤ Kalau tidak ada startDate/endDate tapi ada month
    else if (month) {
      const fallbackStart = `${month}-01`;
      const fallbackEnd = `${month}-31`; // aman secara lexicographical

      dateFilters.push(
        { $gte: ["$$item.Tr_teknis_tanggal", fallbackStart] },
        { $lt: ["$$item.Tr_teknis_tanggal", fallbackEnd] }
      );
    }

    // ➤ Filter kategori teknis jika ada
    if (type) {
      dateFilters.push({
        $eq: ["$$item.Tr_teknis_kategori", type],
      });
    }

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          Tr_teknis_work_order_terpakai: {
            $filter: {
              input: "$Tr_teknis_work_order_terpakai",
              as: "item",
              cond: dateFilters.length
                ? { $and: dateFilters }
                : { $toBool: true },
            },
          },
        },
      },
      {
        $match: {
          "Tr_teknis_work_order_terpakai.0": { $exists: true },
        },
      },
      { $unwind: "$Tr_teknis_work_order_terpakai" },
      { $replaceRoot: { newRoot: "$Tr_teknis_work_order_terpakai" } },
    ];

    const result = await Tr_teknis.aggregate(pipeline);

    if (mode === "data") {
      return res.status(200).json(result);
    } else {
      return res.status(200).json(result.length);
    }

  } catch (error) {
    console.error("Error fetching work orders:", error);
    res.status(500).json({
      message: "Error fetching work orders",
      error: error.message,
    });
  }
};


// FIND ONE BY ID
const getTrTeknisById = async (req, res) => {
  try {
    const { id } = req.params;
    const TrTeknis = await Tr_teknis.findById(id);
    res.status(200).json(TrTeknis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrTeknisEvidentById = async (req, res) => {
  try {
    const { logistikType, logistikdate, logistikNumber, id } = req.params;

    // Construct the full logistik_id
    const logistik_id = `${logistikType}/${logistikdate}/${logistikNumber}`;

    // Convert id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Query the document
    const TrTeknis = await Tr_teknis.findOne({
      Tr_teknis_logistik_id: logistik_id,
      // "Tr_teknis_work_order_terpakai._id": objectId,
    });

    if (!TrTeknis) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Find the specific item within Tr_teknis_work_order_terpakai array
    const workOrderItem = TrTeknis.Tr_teknis_work_order_terpakai.find(
      (item) => item._id.toString() === objectId.toString()
    );

    // Retry with string ID if the first search fails
    if (!workOrderItem) {
      workOrderItem = TrTeknis.Tr_teknis_work_order_terpakai.find(
        (item) => item._id === id
      );
    }

    if (!workOrderItem) {
      return res.status(404).json({ message: "Work order item not found" });
    }

    // Prepare response object
    const responseData = {
      ...workOrderItem,
      Tr_teknis_logistik_id: TrTeknis.Tr_teknis_logistik_id,
    };

    // Send the extracted work order item with related fields
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrTeknis = async (req, res) => {
  try {
    const TrTeknis = await Tr_teknis.create(req.body);
    res.status(200).json(TrTeknis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createTrTeknisGambar = async (req, res) => {
  try {
    const { Tr_teknis_jenis, ...dynamicFields } = req.body;

    // **1. Definisikan field gambar berdasarkan jenis pekerjaan**
    const imageFieldMapping = {
      PSB: [
        "Tr_teknis_evident_progress",
        "Tr_teknis_evident_odp_depan",
        "Tr_teknis_evident_odp_dalam",
        "Tr_teknis_evident_redaman_ont",
        "Tr_teknis_evident_redaman_odp",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
        "Tr_teknis_evident_kertas_psb",
        "Tr_teknis_evident_review_google",
        "Tr_teknis_evident_speed_test",
        "Tr_teknis_evident_pelanggan_dengan_pelanggan",
        "Tr_teknis_evident_pelanggan_depan_rumah",
      ],
      MT: [
        "Tr_teknis_redaman_sebelum",
        "Tr_teknis_evident_kendala_1",
        "Tr_teknis_evident_kendala_2",
        "Tr_teknis_evident_modem_sebelum",
        "Tr_teknis_evident_modem_sesudah",
        "Tr_teknis_evident_proses_sambung",
        "Tr_teknis_redaman_sesudah",
        "Tr_teknis_redaman_out_odp",
        "Tr_teknis_redaman_pelanggan",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
      ],
      INFRA: [
        "Tr_teknis_redaman_sebelum",
        "Tr_teknis_evident_kendala_1",
        "Tr_teknis_evident_kendala_2",
        "Tr_teknis_evident_kendala_3",
        "Tr_teknis_evident_proses_sambung",
        "Tr_teknis_redaman_sesudah",
        "Tr_teknis_redaman_out_odp",
        "Tr_teknis_redaman_pelanggan",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
      ],
    };

    const imageFields = imageFieldMapping[Tr_teknis_jenis] || [];
    const Tr_teknis_images = {};

    // **2. Cek apakah ada file upload dari komputer (`req.files`)**
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (imageFields.includes(file.fieldname)) {
          Tr_teknis_images[file.fieldname] = file.filename;
        }
      });
    }

    // **3. Jika ada URL gambar di `req.body`, download gambar dan simpan di server**
    for (const field of imageFields) {
      if (!Tr_teknis_images[field] && dynamicFields[field]) {
        const downloadedFileName = await downloadImage(dynamicFields[field]);
        if (downloadedFileName) {
          Tr_teknis_images[field] = downloadedFileName;
        }
      }
    }

    // **4. Simpan data ke database**
    const newData = new Tr_teknis({
      ...dynamicFields,
      Tr_teknis_jenis,
      Tr_teknis_images,
    });

    await newData.save();
    res.status(201).json({
      message: "Data created successfully with images",
      newData,
    });
  } catch (error) {
    console.error("Failed to save data:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateTrTeknisWorkOrderTerpakai = async (req, res) => {
  try {
    let {
      Tr_teknis_logistik_id,
      Tr_teknis_work_order_terpakai_material,
      Tr_teknis_work_order_retur,
      Tr_teknis_jenis,
      Tr_teknis_kategori,
      Tr_teknis_trouble,
      Tr_teknis_action,
      Tr_teknis_team,
      Tr_teknis_pelanggan_id,
      Tr_teknis_pelanggan_nama,
      Tr_teknis_pelanggan_server,
      Tr_teknis_user_updated,
      Tr_teknis_keterangan,
      Tr_teknis_created,
      Tr_teknis_tanggal,
      ...dynamicFields
    } = req.body;

    let materialTerpakai = [];
    let materialKembali = [];
    if (Tr_teknis_work_order_terpakai_material) {
      if (typeof Tr_teknis_work_order_terpakai_material === "string") {
        materialTerpakai = JSON.parse(Tr_teknis_work_order_terpakai_material);
      } else if (Array.isArray(Tr_teknis_work_order_terpakai_material)) {
        materialTerpakai = Tr_teknis_work_order_terpakai_material;
      }
    }
    if (Tr_teknis_work_order_retur) {
      if (typeof Tr_teknis_work_order_retur === "string") {
        materialKembali = JSON.parse(Tr_teknis_work_order_retur);
      } else if (Array.isArray(Tr_teknis_work_order_retur)) {
        materialKembali = Tr_teknis_work_order_retur;
      }
    }

    const imageFieldsInfra = [
      "Tr_teknis_evident_start",
      "Tr_teknis_evident_progress",
      "Tr_teknis_evident_end"
    ];
    let Tr_teknis_images = {};
    if (Tr_teknis_kategori === "INFRA") {
      imageFieldsInfra.forEach(field => {
        Tr_teknis_images[field] = [];
      });

      if (dynamicFields) {
        Object.keys(Tr_teknis_images).forEach(key => {
          let parsed = dynamicFields[key];
          
          // Coba parsing jika bentuknya string
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              parsed = [];
            }
          }
      
          if (Array.isArray(parsed) && parsed.length > 0) {
            Tr_teknis_images[key].push(...parsed.map(item => item ?? ""));
          }
        });
      }
      
      for (const field in Tr_teknis_images) {
        if (Tr_teknis_images.hasOwnProperty(field) && Tr_teknis_images[field]) {
          let images = Tr_teknis_images[field]; // Ambil array gambar
          for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (typeof img === "string" && img.startsWith("http")) {
              console.log('data image', img)
              const downloadedFileName = await downloadImage(img);
              if (downloadedFileName) {
                Tr_teknis_images[field][i] = downloadedFileName; // Ganti URL dengan nama file lokal
              }
            }
          }
        }
      }

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
      
          // Gunakan regex untuk menangkap nama field dan index
          const match = file.fieldname.match(/^(.*?)\[(\d+)\]$/);
          if (match) {
            const fieldName = match[1]; // Nama field, misalnya "Tr_teknis_evident_start"
            const index = parseInt(match[2], 10); // Index array, misalnya 0
      
            // Pastikan field termasuk dalam daftar imageFieldsInfra
            if (imageFieldsInfra.includes(fieldName)) {
              // Jika field belum ada di Tr_teknis_images, inisialisasi sebagai array
              if (!Tr_teknis_images[fieldName]) {
                Tr_teknis_images[fieldName] = [];
              }
      
              // Simpan file ke index yang sesuai
              Tr_teknis_images[fieldName][index] = file.filename;
            }
          }
        });
      }
    } else {
      const imageFieldMapping = {
        PSB: [
          "Tr_teknis_evident_progress",
          "Tr_teknis_evident_odp_depan",
          "Tr_teknis_evident_odp_dalam",
          "Tr_teknis_evident_redaman_ont",
          "Tr_teknis_evident_redaman_odp",
          "Tr_teknis_evident_marking_dc_start",
          "Tr_teknis_evident_marking_dc_end",
          "Tr_teknis_evident_kertas_psb",
          "Tr_teknis_evident_review_google",
          "Tr_teknis_evident_speed_test",
          "Tr_teknis_evident_pelanggan_dengan_pelanggan",
          "Tr_teknis_evident_pelanggan_depan_rumah",
        ],
        MT: [
          "Tr_teknis_redaman_sebelum",
          "Tr_teknis_evident_kendala_1",
          "Tr_teknis_evident_kendala_2",
          "Tr_teknis_evident_modem_sebelum",
          "Tr_teknis_evident_modem_sesudah",
          "Tr_teknis_evident_proses_sambung",
          "Tr_teknis_redaman_sesudah",
          "Tr_teknis_redaman_out_odp",
          "Tr_teknis_redaman_pelanggan",
          "Tr_teknis_evident_marking_dc_start",
          "Tr_teknis_evident_marking_dc_end",
        ],
      };

      const imageFields = imageFieldMapping[Tr_teknis_kategori];
      if (!imageFields) {
        return res.status(400).json({ message: "Invalid Tr_teknis_kategori value" });
      }

      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (imageFields.includes(file.fieldname)) {
            Tr_teknis_images[file.fieldname] = file.filename;
          }
        });
      }

      for (const field of imageFields) {
        if (!Tr_teknis_images[field] && dynamicFields[field]) {
          const downloadedFileName = await downloadImage(dynamicFields[field]);
          if (downloadedFileName) {
            Tr_teknis_images[field] = downloadedFileName;
          }
        }
      }
    }

    const existingData = await Tr_teknis.findOne({ Tr_teknis_logistik_id });
    if (!existingData) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (Tr_teknis_team) {
      Tr_teknis_team = JSON.parse(Tr_teknis_team);
    }

    let updatedRecord;
    // console.log(materialKembali)
    const workOrderData = {
      _id: new mongoose.Types.ObjectId(),
      Tr_teknis_pelanggan_id,
      Tr_teknis_kategori,
      Tr_teknis_pelanggan_nama,
      Tr_teknis_pelanggan_server,
      Tr_teknis_user_updated,
      Tr_teknis_keterangan,
      Tr_teknis_created,
      Tr_teknis_tanggal,
      Tr_teknis_logistik_id,
      Tr_teknis_team,
      Tr_teknis_work_order_terpakai_material: materialTerpakai,
      Tr_teknis_work_order_retur: materialKembali,
      Tr_teknis_work_order_images: Tr_teknis_images,
    };
    
    if (Tr_teknis_kategori === "MT") {
      workOrderData.Tr_teknis_trouble = Tr_teknis_trouble;
      workOrderData.Tr_teknis_action = Tr_teknis_action;
    }
    
    // console.log(workOrderData)
    updatedRecord = await Tr_teknis.findByIdAndUpdate(
      existingData._id,
      { $push: { Tr_teknis_work_order_terpakai: workOrderData } },
      { new: true }
    );
    
    res.status(200).json({
      message: "Data updated successfully",
      updatedData: updatedRecord,
    });
  } catch (error) {
    console.error("Error during data update:", error);
    res.status(500).json({ message: "An error occurred while updating data" });
  }
};

const updateTrTeknisWorkOrderTerpakaiNonGambar = async (req, res) => {
  try {
    const {
      Tr_teknis_logistik_id,
      Tr_teknis_work_order_terpakai_material,
      Tr_teknis_work_order_retur,
      // Tr_teknis_jenis,
      Tr_teknis_kategori,
      Tr_teknis_trouble,
      Tr_teknis_action,
      Tr_teknis_team,
      Tr_teknis_pelanggan_id,
      Tr_teknis_pelanggan_nama,
      Tr_teknis_pelanggan_server,
      Tr_teknis_user_updated,
      Tr_teknis_keterangan,
      Tr_teknis_created,
      Tr_teknis_tanggal,
      Tr_teknis_progres_end,
      Tr_teknis_progres_start,
      Tr_teknis_work_order_images, // gambar dikirim langsung dari frontend
    } = req.body;

    const existingData = await Tr_teknis.findOne({ Tr_teknis_logistik_id });
    if (!existingData) {
      return res.status(404).json({ message: "Record not found" });
    }

    const materialTerpakai = Array.isArray(Tr_teknis_work_order_terpakai_material)
      ? Tr_teknis_work_order_terpakai_material
      : typeof Tr_teknis_work_order_terpakai_material === "string"
      ? JSON.parse(Tr_teknis_work_order_terpakai_material)
      : [];

    const materialKembali = Array.isArray(Tr_teknis_work_order_retur)
      ? Tr_teknis_work_order_retur
      : typeof Tr_teknis_work_order_retur === "string"
      ? JSON.parse(Tr_teknis_work_order_retur)
      : [];

    const team = typeof Tr_teknis_team === "string" ? JSON.parse(Tr_teknis_team) : Tr_teknis_team;

    const workOrderData = {
      _id: new mongoose.Types.ObjectId(),
      Tr_teknis_pelanggan_id,
      Tr_teknis_kategori,
      Tr_teknis_pelanggan_nama,
      Tr_teknis_pelanggan_server,
      Tr_teknis_user_updated,
      Tr_teknis_keterangan,
      Tr_teknis_created,
      Tr_teknis_tanggal,
      Tr_teknis_logistik_id,
      Tr_teknis_team: team.map(x => x.name),
      Tr_teknis_progres_end,
      Tr_teknis_progres_start,
      Tr_teknis_work_order_terpakai_material: materialTerpakai,
      Tr_teknis_work_order_retur: materialKembali,
      Tr_teknis_work_order_images, // langsung simpan dari frontend
    };

    // console.log(workOrderData)

    if (Tr_teknis_kategori === "MT") {
      workOrderData.Tr_teknis_trouble = Tr_teknis_trouble;
      workOrderData.Tr_teknis_action = Tr_teknis_action;
    }

    const updatedRecord = await Tr_teknis.findByIdAndUpdate(
      existingData._id,
      { $push: { Tr_teknis_work_order_terpakai: workOrderData } },
      { new: true }
    );

    res.status(200).json({
      message: "Data updated successfully",
      updatedData: updatedRecord,
    });
  } catch (error) {
    console.error("Error during data update:", error);
    res.status(500).json({ message: "An error occurred while updating data" });
  }
};

const getMonthlyDataPerYear = async (req, res) => {
  try {
    const { domain, hierarchy, type } = req.params;
    const { year = new Date().getFullYear(), deleted = "N", range } = req.query;

    const companyCodes = await findByHierarchyAndDomain(hierarchy, domain, 1.1);
    const baseMatch = {
      companyCode: companyCodes,
      Tr_teknis_deleted: deleted,
    };

    if (range) {
      const rangeNum = parseInt(range);
      const totalGroups = 6;
      const totalMonths = rangeNum * totalGroups;

      const now = new Date();
      now.setDate(1);
      const start = new Date(now);
      start.setMonth(now.getMonth() - totalMonths + 1);

      const startMonth = start.toISOString().slice(0, 7);

      const pipeline = [
        { $match: baseMatch },
        { $unwind: "$Tr_teknis_work_order_terpakai" },
        {
          $match: {
            ...(type && {
              "Tr_teknis_work_order_terpakai.Tr_teknis_kategori": type,
            }),
            "Tr_teknis_work_order_terpakai.Tr_teknis_tanggal": {
              $gte: `${startMonth}-01`,
            },
          },
        },
        {
          $project: {
            month: {
              $substrBytes: ["$Tr_teknis_work_order_terpakai.Tr_teknis_tanggal", 0, 7],
            },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ];

      const agg = await Tr_teknis.aggregate(pipeline);

      const monthMap = {};
      agg.forEach(({ _id, total }) => {
        monthMap[_id] = total;
      });

      const result = [];
      const labels = [];

      for (let i = 0; i < totalGroups; i++) {
        let groupSum = 0;
        let labelStart = null;
        let labelEnd = null;

        for (let j = 0; j < rangeNum; j++) {
          const d = new Date(start);
          d.setMonth(start.getMonth() + i * rangeNum + j);
          const key = d.toISOString().slice(0, 7);
          groupSum += monthMap[key] || 0;

          if (j === 0) labelStart = new Date(d);
          if (j === rangeNum - 1) labelEnd = new Date(d);
        }

        result.push(groupSum);

        const label = `${labelStart.toLocaleString('default', { month: 'short' })} ${labelStart.getFullYear()} - ${labelEnd.toLocaleString('default', { month: 'short' })} ${labelEnd.getFullYear()}`;
        labels.push(label);
      }

      return res.status(200).json({ result, labels });
    }

    const pipeline = [
      { $match: baseMatch },
      { $unwind: "$Tr_teknis_work_order_terpakai" },
      {
        $match: {
          "Tr_teknis_work_order_terpakai.Tr_teknis_tanggal": {
            $regex: `^${year}-`,
          },
          ...(type && {
            "Tr_teknis_work_order_terpakai.Tr_teknis_kategori": type,
          }),
        },
      },
      {
        $group: {
          _id: {
            $substrBytes: ["$Tr_teknis_work_order_terpakai.Tr_teknis_tanggal", 5, 2],
          },
          total: { $sum: 1 },
        },
      },
    ];

    const agg = await Tr_teknis.aggregate(pipeline);
    const monthCounts = Array(12).fill(0);
    agg.forEach(({ _id, total }) => {
      const idx = parseInt(_id, 10) - 1;
      if (idx >= 0 && idx < 12) monthCounts[idx] = total;
    });

    return res.status(200).json(monthCounts);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Fungsi bantu untuk konversi nomor bulan ke singkatan nama
function formatMonthKey(monthIndex) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[monthIndex];
}


// const updateTrTeknisEvidentById = async (req, res) => {
//   try {
//     const { logistikType, logistikdate, logistikNumber, id } = req.params;
//     const objectId = new mongoose.Types.ObjectId(id);
//     const Tr_teknis_logistik_id = `${logistikType}/${logistikdate}/${logistikNumber}`;

//     // Debug: Cek apakah dokumen ada
//     const documentExists = await Tr_teknis.findOne({
//       Tr_teknis_logistik_id,
//       "Tr_teknis_work_order_terpakai._id": objectId,
//     });

//     if (!documentExists) {
//       return res.status(404).json({ message: "Data tidak ditemukan" });
//     }

//     // Parse form data
//     const updates = { ...req.body };

//     // Cari work order berdasarkan ID
//     let workOrderImages = documentExists.Tr_teknis_work_order_terpakai.find(
//       (x) => x._id.toString() === id
//     );

//     if (!workOrderImages) {
//       return res.status(404).json({ message: "Work order tidak ditemukan" });
//     }

//     // Parse JSON jika diperlukan
//     if (updates.Tr_teknis_team) {
//       try {
//         updates.Tr_teknis_team = JSON.parse(updates.Tr_teknis_team);
//       } catch (error) {
//         return res.status(400).json({ message: "Format Tr_teknis_team tidak valid" });
//       }
//     }
//     if (updates.Tr_teknis_work_order_terpakai_material) {
//       try {
//         updates.Tr_teknis_work_order_terpakai_material = JSON.parse(
//           updates.Tr_teknis_work_order_terpakai_material
//         );
//       } catch (error) {
//         return res.status(400).json({ message: "Format Tr_teknis_work_order_terpakai_material tidak valid" });
//       }
//     }

    
//     const imageFieldsInfra = [
//       "Tr_teknis_evident_start",
//       "Tr_teknis_evident_progress",
//       "Tr_teknis_evident_end"
//     ];
//     let Tr_teknis_images = {};
//     if (updates.Tr_teknis_kategori === "INFRA") {
//       imageFieldsInfra.forEach(field => {
//         Tr_teknis_images[field] = [];
//       });
//       if (updates) {
//         // Loop untuk mencari key yang mengandung "Tr_teknis_work_order_images."
//         Object.keys(updates).forEach((fullKey) => {
//           if (fullKey.startsWith("Tr_teknis_work_order_images.")) {
//             // Ambil bagian setelah "Tr_teknis_work_order_images."
//             const key = fullKey.replace("Tr_teknis_work_order_images.", "");
      
//             // Pastikan key ini ada dalam Tr_teknis_images
//             if (Tr_teknis_images.hasOwnProperty(key)) {
//               // Tambahkan data dari updates ke dalam Tr_teknis_images
//               Tr_teknis_images[key].push(...updates[fullKey].map(item => item ?? ""));
//             }
//           }
//         });
//       }    
      

//       for (const field in Tr_teknis_images) {
//         if (Tr_teknis_images.hasOwnProperty(field) && Tr_teknis_images[field]) {
//           let images = Tr_teknis_images[field]; // Ambil array gambar
//           for (let i = 0; i < images.length; i++) {
//             let img = images[i];
//             if (typeof img === "string" && img.startsWith("http")) {
//               const downloadedFileName = await downloadImage(img);
//               if (downloadedFileName) {
//                 Tr_teknis_images[field][i] = downloadedFileName; // Ganti URL dengan nama file lokal
//               }
//             }
//           }
//         }
//       }

//       if (req.files && req.files.length > 0) {
//         req.files.forEach((file) => {
      
//           // Hapus prefix "Tr_teknis_work_order_images."
//           const cleanedFieldname = file.fieldname.replace(/^Tr_teknis_work_order_images\./, "");
      
//           // Gunakan regex untuk menangkap nama field dan index
//           const match = cleanedFieldname.match(/^(.*?)\[(\d+)\]$/);
//           if (match) {
//             const fieldName = match[1]; // Nama field, misalnya "Tr_teknis_evident_start"
//             const index = parseInt(match[2], 10); // Index array, misalnya 0
      
//             // Pastikan field termasuk dalam daftar imageFieldsInfra
//             if (imageFieldsInfra.includes(fieldName)) {
//               // Jika field belum ada di Tr_teknis_images, inisialisasi sebagai array
//               if (!Tr_teknis_images[fieldName]) {
//                 Tr_teknis_images[fieldName] = [];
//               }
      
//               // Simpan file ke index yang sesuai
//               Tr_teknis_images[fieldName][index] = file.filename;
//             }
//           }
//         });
//       }      
//     } else {
//       const imageFieldMapping = {
//         PSB: [
//           "Tr_teknis_evident_progress",
//           "Tr_teknis_evident_odp_depan",
//           "Tr_teknis_evident_odp_dalam",
//           "Tr_teknis_evident_redaman_ont",
//           "Tr_teknis_evident_redaman_odp",
//           "Tr_teknis_evident_marking_dc_start",
//           "Tr_teknis_evident_marking_dc_end",
//           "Tr_teknis_evident_kertas_psb",
//           "Tr_teknis_evident_review_google",
//           "Tr_teknis_evident_speed_test",
//           "Tr_teknis_evident_pelanggan_dengan_pelanggan",
//           "Tr_teknis_evident_pelanggan_depan_rumah",
//         ],
//         MT: [
//           "Tr_teknis_redaman_sebelum",
//           "Tr_teknis_evident_kendala_1",
//           "Tr_teknis_evident_kendala_2",
//           "Tr_teknis_evident_modem_sebelum",
//           "Tr_teknis_evident_modem_sesudah",
//           "Tr_teknis_evident_proses_sambung",
//           "Tr_teknis_redaman_sesudah",
//           "Tr_teknis_redaman_out_odp",
//           "Tr_teknis_redaman_pelanggan",
//           "Tr_teknis_evident_marking_dc_start",
//           "Tr_teknis_evident_marking_dc_end",
//         ],
//       };

//       const imageFields = imageFieldMapping[updates.Tr_teknis_kategori];
//       if (!imageFields) {
//         return res.status(400).json({ message: "Invalid Tr_teknis_kategori value" });
//       }
//       imageFields.forEach(field => {
//         Tr_teknis_images[field] = "";
//       });
      
//       if (updates) {
//         Object.keys(Tr_teknis_images).forEach((key) => {
//           if (updates.hasOwnProperty(key)) {
//             Tr_teknis_images[key] = updates[key];
//           }
//         });
//       }   

//       if (req.files && req.files.length > 0) {
//         req.files.forEach((file) => {
//           if (imageFields.includes(file.fieldname)) {
//             Tr_teknis_images[file.fieldname] = file.filename;
//           }
//         });
//       }

      
//       // Proses gambar yang berupa URL
//       for (const key of imageFields) {
//         if (updates[key] && typeof updates[key] === "string" && updates[key].startsWith("http")) {
//           const fileName = await downloadImage(updates[key]);
//           if (fileName) {
//             Tr_teknis_images[key] = fileName;
//           }
//         } else if (updates[key] === "" || updates[key] === null) {
//           Tr_teknis_images[key] = "";
//         }
//         delete updates[key];
//       }
//     }
    
//     const filter = {
//         Tr_teknis_logistik_id,
//         "Tr_teknis_work_order_terpakai._id": objectId,
// };
// if (typeof updates.Tr_teknis_team === 'string') {
//   updates.Tr_teknis_team = JSON.parse(updates.Tr_teknis_team);
// }
// const updateQuery = {
//     $set: {
//       ...Object.fromEntries(
//         Object.entries(updates).filter(([key]) => key !== "_id" && key !== "Tr_teknis_images").map(([key, value]) => [
//           `Tr_teknis_work_order_terpakai.$[elem].${key}`,
//           value,
//         ])
//       )
//     },
// };
// const options = {
//       arrayFilters: [{ "elem._id": objectId }],
//       new: true,
// };

//     await Tr_teknis.updateOne(filter, updateQuery, options);
//     const updatedRecord = await Tr_teknis.findOneAndUpdate(filter, {
//       $set: {
//         "Tr_teknis_work_order_terpakai.$[elem].Tr_teknis_work_order_images": Tr_teknis_images,
//       },
//     }, options);

//     res.status(200).json({ message: "Gambar berhasil diperbarui", updatedData: updatedRecord });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Terjadi kesalahan saat update" });
//   }
// };
const updateTrTeknisEvidentById = async (req, res) => {
  try {
    const { logistikType, logistikdate, logistikNumber, id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const Tr_teknis_logistik_id = `${logistikType}/${logistikdate}/${logistikNumber}`;

    const filter = {
      Tr_teknis_logistik_id,
      "Tr_teknis_work_order_terpakai._id": objectId,
    };

    const updates = { ...req.body };

    const updateQuery = {
      $set: Object.fromEntries(
        Object.entries(updates)
          .filter(([key]) => key !== "_id")
          .map(([key, val]) => [`Tr_teknis_work_order_terpakai.$[elem].${key}`, val])
      ),
    };

    const options = {
      arrayFilters: [{ "elem._id": objectId }],
      new: true,
    };

// console.log('filter: ',filter)
// console.log('query: ',updateQuery)
// console.log('options: ',options)

    const updatedRecord = await Tr_teknis.findOneAndUpdate(filter, updateQuery, options);
console.log(updatedRecord)
    if (!updatedRecord) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({ message: "Data berhasil diperbarui", updatedData: updatedRecord });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat update" });
  }
};


const updateTrTeknisGambar = async (req, res) => {
  try {
    const { _id, Tr_teknis_jenis, ...dynamicFields } = req.body;

    // Define image fields based on Tr_teknis_jenis
    const imageFieldMapping = {
      PSB: [
        "Tr_teknis_evident_progress",
        "Tr_teknis_evident_odp_depan",
        "Tr_teknis_evident_odp_dalam",
        "Tr_teknis_evident_ont_depan",
        "Tr_teknis_evident_ont_belakang",
        "Tr_teknis_evident_redaman_ont",
        "Tr_teknis_evident_redaman_odp",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
        "Tr_teknis_evident_kertas_psb",
        "Tr_teknis_evident_review_google",
        "Tr_teknis_evident_speed_test",
        "Tr_teknis_evident_pelanggan_dengan_pelanggan",
        "Tr_teknis_evident_pelanggan_depan_rumah",
      ],
      MT: [
        "Tr_teknis_redaman_sebelum",
        "Tr_teknis_evident_kendala_1",
        "Tr_teknis_evident_kendala_2",
        "Tr_teknis_evident_modem_sebelum",
        "Tr_teknis_evident_modem_sesudah",
        "Tr_teknis_evident_proses_sambung",
        "Tr_teknis_redaman_sesudah",
        "Tr_teknis_redaman_out_odp",
        "Tr_teknis_redaman_pelanggan",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
      ],
      INFRA: [
        "Tr_teknis_redaman_sebelum",
        "Tr_teknis_evident_kendala_1",
        "Tr_teknis_evident_kendala_2",
        "Tr_teknis_evident_kendala_3",
        "Tr_teknis_evident_proses_sambung",
        "Tr_teknis_redaman_sesudah",
        "Tr_teknis_redaman_out_odp",
        "Tr_teknis_redaman_pelanggan",
        "Tr_teknis_evident_marking_dc_start",
        "Tr_teknis_evident_marking_dc_end",
      ],
    };

    const imageFields = imageFieldMapping[Tr_teknis_jenis];
    if (!imageFields) {
      return res.status(400).json({ message: "Invalid Tr_teknis_jenis value" });
    }

    // Fetch the existing document
    const existingData = await Tr_teknis.findById(_id);
    if (!existingData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Convert the Map to an object
    const existingImages = Object.fromEntries(existingData.Tr_teknis_images);

    // Merge the existing images with the updated ones
    const updatedImages = { ...existingImages };

    // Update images if new files are provided
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const { fieldname, filename } = file;
        if (imageFields.includes(fieldname)) {
          updatedImages[fieldname] = filename; // Only update the changed fields
        }
      });
    }

    // Merge the dynamic fields (non-image data) from the request
    const mergedData = {
      ...existingData.toObject(), // Include the current data
      ...dynamicFields, // Overwrite with the new dynamic fields
      Tr_teknis_images: updatedImages, // Use the merged images object
    };

    // Parse Tr_teknis_material_terpakai if provided in dynamicFields
    if (dynamicFields.Tr_teknis_material_terpakai) {
      mergedData.Tr_teknis_material_terpakai = JSON.parse(
        dynamicFields.Tr_teknis_material_terpakai
      );
    }

    // Prepare the update object
    const updateData = {
      ...mergedData,
    };

    // Update the document using updateOne
    const updated = await Tr_teknis.updateOne(
      { _id },
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ message: "Data updated successfully", updated });
  } catch (error) {
    console.error("Failed to update data:", error);
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik
const updateTrTeknis = async (req, res) => {
  try {
    const { id } = req.params;

    const TrTeknis = await Tr_teknis.findByIdAndUpdate(id, req.body);

    if (!TrTeknis) {
      return res.status(404).json({ message: "TrTeknis not found" });
    }

    const updatedTrTeknis = await Tr_teknis.findById(id);
    res.status(200).json(updatedTrTeknis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX

const getBonPrefix = async (req, res) => {
  try {
    const { type, date, domain } = req.params;
    
    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain('',domain, 1)
    const filter = { companyCode: newDomain };

    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `${type}/${date}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await Tr_teknis.find({
      ...filter,
      Tr_teknis_logistik_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}/001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_teknis_logistik_id.split("/").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("/").pop() || "0");
      return currentNumber > maxNumber
        ? currentItem.Tr_teknis_logistik_id
        : maxId;
    }, "");

    // Ambil angka dari ID terbaru dan tambahkan 1
    const latestNumber = parseInt(latestId.split("/").pop() || "0");
    const nextNumber = (latestNumber + 1).toString().padStart(3, "0");

    // Gabungkan prefix dengan angka yang baru
    const nextId = `${prefix}/${nextNumber}`;

    // Kembalikan hasilnya
    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrTeknis,
  getTrTeknisEvident,
  getTrTeknisEvidentByMonth,
  getTrTeknisById,
  getAllWorkOrders,
  getTrTeknisEvidentById,
  getMonthlyDataPerYear,
  createTrTeknis,
  createTrTeknisGambar,
  updateTrTeknisWorkOrderTerpakai,
  updateTrTeknisWorkOrderTerpakaiNonGambar,
  updateTrTeknis,
  updateTrTeknisGambar,
  updateTrTeknisEvidentById,
  getBonPrefix,
};
