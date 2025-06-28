const Item = require("../../models/Umum/Item.Models.js");


const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getMasterItem = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1)
    const filter = { companyCode: newDomain };

    // Add optional filters if provided
    if (deleted) filter.item_deleted = deleted;

    const MasterItem = await Item.find(filter, { item_detail: 0 }); //tidak menginclude kan item_detail
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMasterItemByLocation = async (req, res) => {
  try {
    const { domain, hierarchy, deleted, location } = req.params;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    if (deleted) filter.item_deleted = deleted;

    const MasterItem = await Item.aggregate([
      { $match: filter },

      { $unwind: "$item_detail" },

      {
        $addFields: {
          historyLocations: {
            $ifNull: ["$item_detail.item_detail_history_location", []]
          }
        }
      },

      {
        $match: {
          "historyLocations.0": { $exists: true }
        }
      },

      {
        $addFields: {
          lastLocation: {
            $let: {
              vars: {
                lastLocationObj: {
                  $arrayElemAt: [
                    "$historyLocations",
                    { $subtract: [{ $size: "$historyLocations" }, 1] }
                  ]
                }
              },
              in: "$$lastLocationObj.item_detail_location_name"
            }
          }
        }
      },

      { $match: { lastLocation: location } },

      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          item_detail: { $push: "$item_detail" }
        }
      },

      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$doc", { item_detail: "$item_detail" }] }
        }
      },

      {
        $project: {
          "item_detail.item_detail_history_masuk": 0,
          "item_detail.item_detail_history_keluar": 0
        }
      }
    ]);

    res.status(200).json(MasterItem);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllMasterItemWithLocation = async (req, res) => {
  try {
    const { domain, hierarchy } = req.params;
    const { deleted: rawDeleted, status: rawStatus } = req.query;

    // Bersihkan nilai kosong
    const deleted = rawDeleted === '' ? undefined : rawDeleted;

    let statusCondition = null;
    if (rawStatus === '') {
      // Jika status dikirim tapi kosong → cari data tanpa status_penggunaan
      statusCondition = {
        "item_detail.item_detail_status_penggunaan": { $exists: false }
      };
    } else if (rawStatus) {
      // Jika status ada isinya (misal: "S-N") → ubah jadi array dan cari dengan $in
      const statusArray = rawStatus.split('-');
      statusCondition = {
        "item_detail.item_detail_status_penggunaan": { $in: statusArray }
      };
    }

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    if (deleted) {
      filter.item_deleted = deleted;
    }

    const pipeline = [
      { $match: filter },
      { $unwind: "$item_detail" },
      {
        $addFields: {
          historyLocations: {
            $ifNull: ["$item_detail.item_detail_history_location", []]
          }
        }
      },
      {
        $match: {
          "historyLocations.0": { $exists: true }
        }
      }
    ];

    // Tambahkan filter berdasarkan status jika diperlukan
    if (statusCondition) {
      pipeline.push({ $match: statusCondition });
    }

    // Group dan rapikan kembali data
    pipeline.push(
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          item_detail: { $push: "$item_detail" }
        }
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$doc", { item_detail: "$item_detail" }] }
        }
      },
      {
        $project: {
          "item_detail.item_detail_history_masuk": 0,
          "item_detail.item_detail_history_keluar": 0
        }
      }
    );

    const MasterItem = await Item.aggregate(pipeline);
    res.status(200).json(MasterItem);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMasterItemWithInOutSummarySafe = async (req, res) => {
  try {
    const { domain, hierarchy, deleted } = req.params;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    if (deleted) filter.item_deleted = deleted;

    const MasterItem = await Item.aggregate([
      { $match: filter },
      { $unwind: "$item_detail" },

      {
        $addFields: {
          totalIn: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ["$item_detail.item_detail_history_masuk", []] },
                    as: "inItem",
                    cond: {
                      $and: [
                        { $ne: ["$$inItem.item_detail_history_quantity", null] },
                        { $ne: ["$$inItem.item_detail_history_quantity", ""] }
                      ]
                    }
                  }
                },
                as: "validIn",
                in: { $toInt: "$$validIn.item_detail_history_quantity" }
              }
            }
          },
          totalOut: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ["$item_detail.item_detail_history_keluar", []] },
                    as: "outItem",
                    cond: {
                      $and: [
                        { $ne: ["$$outItem.item_detail_history_quantity", null] },
                        { $ne: ["$$outItem.item_detail_history_quantity", ""] }
                      ]
                    }
                  }
                },
                as: "validOut",
                in: { $toInt: "$$validOut.item_detail_history_quantity" }
              }
            }
          }
        }
      },

      {
        $project: {
          item_id: 1,
          item_nama: 1,
          item_tipe: 1,
          item_satuan: 1,
          item_keterangan: 1,
          item_gambar: 1,
          item_user_created: 1,
          item_created: 1,
          item_updated: 1,
          item_deleted: 1,
          companyName: 1,
          companyCode: 1,
          createdAt: 1,
          updatedAt: 1,
          item_detail: {
            item_detail_item_kode: "$item_detail.item_detail_item_kode",
            item_detail_item_nama: "$item_detail.item_detail_item_nama",
            item_detail_item_price: "$item_detail.item_detail_item_price",
            item_detail_kode_sn: "$item_detail.item_detail_kode_sn",
            item_detail_kode_sn_status: "$item_detail.item_detail_kode_sn_status",
            item_detail_satuan: "$item_detail.item_detail_satuan",
            item_detail_quantity: "$item_detail.item_detail_quantity",
            item_detail_status_penggunaan: "$item_detail.item_detail_status_penggunaan",
            item_detail_status_kondisi: "$item_detail.item_detail_status_kondisi",
            item_detail_history_masuk: "$totalIn",
            item_detail_history_keluar: "$totalOut"
          }
        }
      },

      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          item_detail: { $push: "$item_detail" }
        }
      },

      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ["$doc", { item_detail: "$item_detail" }] }
        }
      }
    ]);

    res.status(200).json(MasterItem);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET BY SATUAN 
const getMasterItemByItemSatuan = async (req, res) => {
  try {
    const MasterItem = await Item.find({ item_domain: req.params.domain, item_status: "Y", item_satuan: req.params.satuan });
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// FIND ONE BY ID
const getMasterItemId = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = {_id: id}

    const MasterItem = await Item.findById(filter);
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Find One by name 
const getMasterItemName = async (req, res) => {
  try {
    // const { id } = req.params;
    const MasterItem = await Item.findOne({ item_nama: req.params.item_nama, item_status: "Y" });
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createMasterItem = async (req, res) => {
  try {
    const MasterItem = await Item.create(req.body);
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TRIAL CREATE WITH GAMBAR 
const createMasterItemGambar = async (req, res) => {
  try {
    const { item_gambar, ...dynamicFields } = req.body;

    const newData = new Item({
      ...dynamicFields,
      item_gambar: ""
    });

    try {
      newData.item_bundle = JSON.parse(newData.item_bundle);
      newData.item_harga = JSON.parse(newData.item_harga);
      newData.item_konversi = JSON.parse(newData.item_konversi);
      newData.companyCode = JSON.parse(newData.companyCode);
      newData.item_detail = {}
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
      throw new Error('Invalid JSON format in input');
    }

    if (req.file && req.file.fieldname === 'item_gambar') {
      newData.item_gambar = req.file.filename;
    }
    newData.item_detail = {item_detail_price: []}
    await newData.save();
    res.status(201).json({ message: 'Data Item Tersimpan' });
  } catch (error) {
    console.error('Gagal menyimpan data', error);
    res.status(500).json({ message: error.message });
  }
};

const updateMasterItemGambar = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the item to update
    const { item_id, item_gambar, ...dynamicFields } = req.body;

    // Find the existing item
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Data Item not found' });
    }

    // Check if the `item_id` has changed
    if (item_id && item_id !== existingItem.item_id) {
      // Check if the new `item_id` is already used
      const itemWithSameId = await Item.findOne({ item_id });
      if (itemWithSameId) {
        return res.status(400).json({ message: 'Kode Item Telah Digunakan' });
      }
      // Update `item_id` if it's not already used
      existingItem.item_id = item_id;
    }

    // Update dynamic fields
    Object.keys(dynamicFields).forEach((key) => {
      try {
        // Attempt to parse JSON fields, fallback to raw data if parsing fails
        existingItem[key] = JSON.parse(dynamicFields[key]);
      } catch {
        existingItem[key] = dynamicFields[key];
      }
    });

    // Update image if a new one is uploaded
    if (req.file && req.file.fieldname === 'item_gambar') {
      existingItem.item_gambar = req.file.filename;
    }

    // Optional: Update other fields like `item_detail` if needed
    existingItem.item_detail = existingItem.item_detail || { item_detail_price: [] };

    // Save the updated item
    await existingItem.save();

    res.status(200).json({ message: 'Data Item Updated', data: existingItem });
  } catch (error) {
    console.error('Failed to update data', error);
    res.status(500).json({ message: error.message });
  }
};

// Create existing item untuk penambahan stok dll 
const createMasterItemExisting = async (req, res) => {
  try {
    const nama = req.params.nama;
    const MasterItem = await Item.find({ item_nama: nama })
    const MasterItemCreate = await Item.create(req.body)
    const MasterItemUpdated = await Item.findOneAndUpdate({ "item_nama": req.body.item_nama }, req.body)
    // .then((data) =>{
    //   res.send(data)
    //   if(data.length < 1){
    //     res.send(data)
    //   } else {
    //     res.send(data)
    //   }
    // });
    if (MasterItem.length === 0) {
      // return res.status(404).json({error:'Data not found'})
      return MasterItemCreate
    } else {
      return Item.findByIdAndUpdate(MasterItem[0]._id, req.body)
      // return MasterItemUpdated
    }

    res.json({ data: "Berhasil mungkin" })
    // res.status(200).send(MasterItem)
    // MasterItem.find({item_nama:nama})
    // .then((data) =>{
    //   res.send(data)
    // })
    // const kosong = "kosong";
    // const ada = "ada isinya";
    // res.status(200).json(MasterItem)
    // if(MasterItem.length < 1){
    //   res.status(200).send(kosong)
    // } else {
    //   res.status(200).send(ada)
    // }
    // res.send(MasterItem)

    // if (!MasterItem) {
    //   return res.status(404).json({ message: "MasterItem not found" })
    // }

    // Hasil dari update 
    // const updatedMasterItem = await Item.find({ item_nama: nama });
    // res.status(200).json(updatedMasterItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};
// Update Banyak Item Detail Berdasarkan Nama dan Lokasi
const updateCurrentItemDetail = async (req, res) => {
  try {
    const dataUpdate = req.body;

    if (!Array.isArray(dataUpdate) || dataUpdate.length === 0) {
      return res.status(400).json({ message: "Data update kosong atau tidak valid." });
    }

    const tipeDenganSN = ["Modem", "Kabel", "Tiang"];
    const bulkOps = [];

    for (const item of dataUpdate) {
      const {
        Sh_item_nama,
        Sh_item_id,
        Sh_item_qty,
        item_detail_history_location,
        status_perubahan,
        item_detail_history,
        Sh_item_tipe,
        item_detail_kode_sn,
        item_detail_kode_sn_status,
        item_detail_status_kondisi,
        item_detail_status_penggunaan
      } = item;

      if (!Sh_item_nama || !Sh_item_id || !item_detail_history_location) continue;

      // --- Siapkan update fields umum
      const updateFields = {
        "item_detail.$[elem].item_detail_quantity": Sh_item_qty
      };

      // --- Jika tipe Modem/Kabel/Tiang, tambahkan SN-related fields
      if (tipeDenganSN.includes(Sh_item_tipe)) {
        if (item_detail_kode_sn !== undefined) {
          updateFields["item_detail.$[elem].item_detail_kode_sn"] = item_detail_kode_sn;
        }
        if (item_detail_kode_sn_status !== undefined) {
          updateFields["item_detail.$[elem].item_detail_kode_sn_status"] = item_detail_kode_sn_status;
        }
        if (item_detail_status_kondisi !== undefined) {
          updateFields["item_detail.$[elem].item_detail_status_kondisi"] = item_detail_status_kondisi;
        }
        if (item_detail_status_penggunaan !== undefined) {
          updateFields["item_detail.$[elem].item_detail_status_penggunaan"] = item_detail_status_penggunaan;
        }
      }

      const updateOps = {
        $set: updateFields
      };

      // --- Push histori sesuai status
      if (status_perubahan === "in") {
        updateOps.$push = {
          "item_detail.$[elem].item_detail_history_masuk": item_detail_history
        };
      } else if (status_perubahan === "out") {
        updateOps.$push = {
          "item_detail.$[elem].item_detail_history_keluar": item_detail_history
        };
      }

      // --- Buat filter dan arrayFilters
      const arrayFilter = {
        "elem.item_detail_item_kode": Sh_item_id,
        "elem.item_detail_history_location": {
          $elemMatch: {
            item_detail_location_name: item_detail_history_location
          }
        }
      };

      if (tipeDenganSN.includes(Sh_item_tipe) && item_detail_kode_sn) {
        arrayFilter["elem.item_detail_kode_sn"] = item_detail_kode_sn;
      }

      bulkOps.push({
        updateOne: {
          filter: {
            item_nama: Sh_item_nama,
            "item_detail.item_detail_item_kode": Sh_item_id,
            "item_detail.item_detail_history_location.item_detail_location_name": item_detail_history_location,
            ...(item_detail_kode_sn && tipeDenganSN.includes(Sh_item_tipe)
              ? { "item_detail.item_detail_kode_sn": item_detail_kode_sn }
              : {})
          },
          update: updateOps,
          arrayFilters: [arrayFilter]
        }
      });
    }

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: "Tidak ada data valid untuk diproses." });
    }

    const result = await Item.bulkWrite(bulkOps);
    res.status(200).json({
      message: "Berhasil update quantity & histori & SN fields",
      result
    });
  } catch (error) {
    console.error("Gagal update:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Banyak Item Detail Berdasarkan Nama dan Lokasi
const updateEvidentItemDetail = async (req, res) => {
  try {
    const dataUpdate = req.body;

    if (!Array.isArray(dataUpdate) || dataUpdate.length === 0) {
      return res.status(400).json({ message: "Data update kosong atau tidak valid." });
    }

    const tipeDenganSN = ["Modem", "Kabel", "Tiang"];
    const bulkOps = [];

    for (const item of dataUpdate) {
      const {
        Sh_item_nama,
        Sh_item_id,
        Sh_item_kode,
        item_properties_qty_akhir,
        item_detail_history_location,
        status_perubahan,
        item_detail_history,
        Sh_item_tipe,
        item_detail_kode_sn,
        item_detail_kode_sn_status,
        item_detail_status_kondisi,
        item_detail_status_penggunaan
      } = item;

      if (
        !Sh_item_nama ||
        !Sh_item_id ||
        !Sh_item_kode ||
        !item_detail_history_location ||
        typeof item_properties_qty_akhir !== "number"
      ) continue;

      const updateOps = {};
      const arrayFilter = {
        "elem.item_detail_item_kode": Sh_item_kode,
        "elem.item_detail_history_location": {
          $elemMatch: {
            item_detail_location_name: item_detail_history_location
          }
        }
      };

      if (item_detail_kode_sn) {
        arrayFilter["elem.item_detail_kode_sn"] = item_detail_kode_sn;
      }

      if (status_perubahan === "in") {
        updateOps.$inc = {
          "item_detail.$[elem].item_detail_quantity": item_properties_qty_akhir
        };
        updateOps.$push = {
          "item_detail.$[elem].item_detail_history_masuk": item_detail_history
        };
      } else if (status_perubahan === "out") {
        updateOps.$inc = {
          "item_detail.$[elem].item_detail_quantity": -item_properties_qty_akhir,
          ...(["Material", "Aset"].includes(Sh_item_tipe)
            ? {
                "item_detail.$[elem].item_detail_quantity_mengambang":
                  -item_properties_qty_akhir,
              }
            : {}),
        };
        updateOps.$push = {
          "item_detail.$[elem].item_detail_history_keluar": item_detail_history,
        };
      }

      if (tipeDenganSN.includes(Sh_item_tipe)) {
        if (!updateOps.$set) updateOps.$set = {};

        if (item_detail_kode_sn !== undefined) {
          updateOps.$set["item_detail.$[elem].item_detail_kode_sn"] = item_detail_kode_sn;
        }
        if (item_detail_kode_sn_status !== undefined) {
          updateOps.$set["item_detail.$[elem].item_detail_kode_sn_status"] = item_detail_kode_sn_status;
        }
        if (item_detail_status_kondisi !== undefined) {
          updateOps.$set["item_detail.$[elem].item_detail_status_kondisi"] = item_detail_status_kondisi;
        }
        if (item_detail_status_penggunaan !== undefined) {
          updateOps.$set["item_detail.$[elem].item_detail_status_penggunaan"] = item_detail_status_penggunaan;
        }
      }

      bulkOps.push({
        updateOne: {
          filter: {
            item_nama: Sh_item_nama,
            item_id: Sh_item_id,
            "item_detail.item_detail_item_kode": Sh_item_kode,
            "item_detail.item_detail_history_location.item_detail_location_name": item_detail_history_location,
            ...(item_detail_kode_sn ? { "item_detail.item_detail_kode_sn": item_detail_kode_sn } : {})
          },
          update: updateOps,
          arrayFilters: [arrayFilter]
        }
      });
    }

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: "Tidak ada data valid untuk diproses." });
    }

    const result = await Item.bulkWrite(bulkOps);
    res.status(200).json({
      message: "Berhasil update quantity & histori & SN fields",
      result
    });
  } catch (error) {
    console.error("Gagal update:", error);
    res.status(500).json({ message: error.message });
  }
};


const updateBonMaterialItemDetail = async (req, res) => {
  try {
    const dataUpdate = req.body;

    if (!Array.isArray(dataUpdate) || dataUpdate.length === 0) {
      return res.status(400).json({ message: "Data update kosong atau tidak valid." });
    }

    const bulkOps = [];

    for (const item of dataUpdate) {
      const {
        Sh_item_nama,
        Sh_item_id,
        Sh_item_kode,
        Sh_item_tipe,
        item_properties_qty_akhir,
        item_detail_history_location,
        item_detail_kode_sn
      } = item;

      if (!Sh_item_nama || !Sh_item_id || !Sh_item_kode || !item_detail_history_location) continue;

      const isMaterialOrAset = ["Material", "Aset"].includes(Sh_item_tipe);

      const updateOps = {};
      const arrayFilter = {
        "elem.item_detail_item_kode": Sh_item_kode,
        "elem.item_detail_history_location": {
          $elemMatch: {
            item_detail_location_name: item_detail_history_location
          }
        }
      };

      if (item_detail_kode_sn) {
        arrayFilter["elem.item_detail_kode_sn"] = item_detail_kode_sn;
      }

      if (isMaterialOrAset) {
        updateOps.$inc = {
          "item_detail.$[elem].item_detail_quantity_mengambang": item_properties_qty_akhir
        };
      } else {
        updateOps.$set = {
          "item_detail.$[elem].item_detail_status_penggunaan": "Y"
        };
      }

      bulkOps.push({
        updateOne: {
          filter: {
            item_nama: Sh_item_nama,
            item_id: Sh_item_id,
            "item_detail.item_detail_item_kode": Sh_item_kode,
            "item_detail.item_detail_history_location.item_detail_location_name": item_detail_history_location,
            ...(item_detail_kode_sn
              ? { "item_detail.item_detail_kode_sn": item_detail_kode_sn }
              : {})
          },
          update: updateOps,
          arrayFilters: [arrayFilter]
        }
      });
    }

    if (bulkOps.length === 0) {
      return res.status(400).json({ message: "Tidak ada data valid untuk diproses." });
    }

    const result = await Item.bulkWrite(bulkOps);
    res.status(200).json({
      message: "Berhasil update quantity_mengambang atau status_penggunaan.",
      result
    });
  } catch (error) {
    console.error("Gagal update bon material:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateNewItemDetail = async (req, res) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Data harus berupa array" });
    }

    let totalMatched = 0;
    let totalPushed = 0;

    for (const data of updates) {
      const itemId = data.Sh_item_nama || data.Sh_item_id; // fallback jika _id tak ada
      const lokasiNama = data.item_detail_history_location;
      const isNonMaterial = ["Kabel", "Modem", "Tiang"].includes(data.Sh_item_tipe);

      // Buat unique ID acak biar pasti beda meskipun field mirip
      const uniqueSuffix = Date.now() + "_" + Math.floor(Math.random() * 10000);

      const newDetail = {
        item_detail_item_kode: data.Sh_item_id,
        item_detail_item_nama: data.Sh_item_jenis || "",
        item_detail_item_price: "0",
        item_detail_satuan: data.Sh_item_satuan || "",
        item_detail_quantity: data.Sh_item_qty,
        item_detail_history_location: [
          {
            item_detail_location_name: lokasiNama,
          },
        ],
        item_detail_history_masuk:
          data.status_perubahan === "in" ? [data.item_detail_history] : [],
        item_detail_history_keluar:
          data.status_perubahan === "out" ? [data.item_detail_history] : [],
        item_detail_unique_id: uniqueSuffix, // Tambahkan ID unik
      };

      if (isNonMaterial) {
        newDetail.item_detail_kode_sn = data.item_detail_kode_sn;
        newDetail.item_detail_status_penggunaan = data.item_detail_status_penggunaan;
        newDetail.item_detail_status_kondisi = data.item_detail_status_kondisi;
        newDetail.item_detail_kode_sn_status = data.item_detail_kode_sn_status;
      }

      const result = await Item.updateOne(
        { item_nama: itemId.toString(),
          companyCode: [0, 1], }, // Pastikan string
        { $push: { item_detail: newDetail } }
      );

      if (result.matchedCount > 0) totalMatched++;
      if (result.modifiedCount > 0) totalPushed++;
    }

    res.status(200).json({
      message: "Berhasil push langsung ke item_detail",
      matchedCount: totalMatched,
      modifiedCount: totalPushed,
    });
  } catch (err) {
    console.error("Error update data:", err);
    res.status(500).json({ message: "Gagal update data", error: err.message });
  }
};


// Updated MasterItem 
const updateMasterItem = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterItem = await Item.findByIdAndUpdate(id, req.body);

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterItem = await Item.findById(id);
    res.status(200).json(updatedMasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update dengan menggunakan nama barang 
const updateMasterByName = async (req, res) => {
  try {
    const nama = req.params.nama;

    const MasterItem = await Item.findOneAndUpdate({ item_nama: nama }, req.body);

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterItem = await Item.findOne({ item_nama: nama });
    res.status(200).json(updatedMasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATED MASTER ITEM STOK 
const updateMasterItemStok = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterItem = await Item.findByIdAndUpdate(id, {
      item_stok: req.body.item_stok
    });

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterItem = await Item.findById(id);
    res.status(200).json(updatedMasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated Master Item ngambil item history
const updatedMasterItemHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterItem = await Item.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      item_stok: req.body.item_stok,
      $push: { item_history: req.body.item_history }
    }
    );

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem tidak ada" });
    }
    const updatedMasterItemHistory = await Item.findById(id);
    res.status(200).json(updatedMasterItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Khusus kabel upadted master item ngambil item history pemakaian kabel
const updatedMasterItemHistoryPemakaianKabel = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterItem = await Item.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      item_stok: req.body.item_stok,
      $push: { item_history_pemakaian_kabel: req.body.item_history_pemakaian_kabel }
    }
    );

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem tidak ada" });
    }
    const updatedMasterItemHistory = await Item.findById(id);
    res.status(200).json(updatedMasterItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedMasterItemHistoryByName = async (req, res) => {
  try {

    const nama = req.params.nama;
    const MasterItem = await Item.findOneAndUpdate({ item_nama: nama }, {
      // item_stok:req.body.item_stok,
      item_stok: req.body.item_stok,
      $push: { item_history: req.body.item_history },
    }
    );

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem tidak ada" });
    }
    const updatedMasterItemHistory = await Item.findOne({ item_nama: nama });
    res.status(200).json(updatedMasterItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedMasterItemList = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterItem = await Item.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      item_stok: req.body.item_stok,
      $push: { item_list: req.body.item_list }
    }
    );

    if (!MasterItem) {
      return res.status(404).json({ message: "MasterItem tidak ada" });
    }
    const updatedMasterItemHistory = await Item.findById(id);
    res.status(200).json(updatedMasterItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trial dari tr logistik ke master item 
const updatedMasterItemHistoryByNametrial = async (req, res) => {
  try {
    // const { id } = req.params;
    for (let i = 0; i < req.body.panjang_item; i++) {
      // const element = array[i];
      var hitung_panjang = i

    }
    const nama = req.params.nama;
    const MasternewItem = await Item.findOne({ item_nama: nama });
    return MasternewItem.forEach(data => {
      res.json(data)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMasterItem,
  getMasterItemByLocation,
  getAllMasterItemWithLocation,
  getMasterItemByItemSatuan,
  getMasterItemId,
  getMasterItemName,
  getMasterItemWithInOutSummarySafe,
  createMasterItem,
  createMasterItemGambar,
  createMasterItemExisting,
  updateCurrentItemDetail,
  updateEvidentItemDetail,
  updateBonMaterialItemDetail,
  updateNewItemDetail,
  updateMasterItem,
  updateMasterItemGambar,
  updateMasterByName,
  updateMasterItemStok,
  updatedMasterItemHistory,
  updatedMasterItemHistoryPemakaianKabel,
  updatedMasterItemHistoryByName,
  updatedMasterItemList,

  // Trial 
  updatedMasterItemHistoryByNametrial
};
