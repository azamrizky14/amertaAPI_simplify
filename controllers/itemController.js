const Item = require("../models/itemModels.js");
// GET BY DOMAIN
const getMasterItem = async (req, res) => {
  try {
    const { domain, deleted } = req.params;

    // Create a filter object dynamically
    const filter = { companyName: domain };

    // Add optional filters if provided
    if (deleted) filter.item_deleted = deleted;

    const MasterItem = await Item.find(filter);
    res.status(200).json(MasterItem);
  } catch (error) {
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
    } catch (error) {
      console.error('Error parsing JSON fields:', error);
      throw new Error('Invalid JSON format in input');
    }

    if (req.file && req.file.fieldname === 'item_gambar') {
      newData.item_gambar = req.file.filename;
    }
    newData.item_detail = {item_detail_stock: []}
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
    existingItem.item_detail = existingItem.item_detail || { item_detail_stock: [] };

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
  getMasterItemByItemSatuan,
  getMasterItemId,
  getMasterItemName,
  createMasterItem,
  createMasterItemGambar,
  createMasterItemExisting,
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
