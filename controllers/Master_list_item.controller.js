const master_list_item = require("../models/Master_list_item.model");

// GET BY DOMAIN
const getMasterListItem = async (req, res) => {
  try {
    const MasterListItem = await master_list_item.find({ item_list_domain: req.params.domain, item_list_status: "Y" });
    res.status(200).json(MasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getMasterListItemid = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterListItem = await master_list_item.findById(id);
    res.status(200).json(MasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Find One by name 
const getMasterListItemName = async (req, res) => {
  try {
    // const { id } = req.params;
    const MasterListItem = await master_list_item.find({ item_list_nama: req.params.name, item_list_status: "Y" });
    res.status(200).json(MasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createMasterListItem = async (req, res) => {
  try {
    const MasterListItem = await master_list_item.create(req.body);
    res.status(200).json(MasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createMasterListItemGambar = async (req, res) => {
  try {
   const { item_list_gambar, ...dynamicFields } = req.body;
    const newData = new master_list_item({ ...dynamicFields, item_list_gambar: req.file.filename });
    await newData.save()
    res.status(201).json({ message: 'Gambar sudah terupload' });
  } catch (error) {
    console.error('Gagal menyimpan data', error);
    res.status(500).json({ message: error.message });
  }
}

// Updated MasterListItem 
const updateMasterListItem = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterListItem = await master_list_item.findByIdAndUpdate(id, req.body);

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem not found" });
    }

    const updatedMasterListItem = await master_list_item.findById(id);
    res.status(200).json(updatedMasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update dengan menggunakan nama barang 
const updateMasterByName = async (req, res) => {
  try {
    const nama = req.params.nama;

    const MasterListItem = await master_list_item.findOneAndUpdate({ item_list_nama: nama }, req.body);

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem not found" });
    }

    const updatedMasterListItem = await master_list_item.findOne({ item_list_nama: nama });
    res.status(200).json(updatedMasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATED MASTER ITEM STOK 
const updateMasterListItemStok = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterListItem = await master_list_item.findByIdAndUpdate(id, {
      item_list_stok: req.body.item_list_stok
    });

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem not found" });
    }

    const updatedMasterListItem = await master_list_item.findById(id);
    res.status(200).json(updatedMasterListItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated Master Item ngambil item history
const updatedMasterListItemHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterListItem = await master_list_item.findByIdAndUpdate(id, {
      // item_list_stok:req.body.item_list_stok,
      // item_list_stok: req.body.item_list_stok,
      item_list_status_pemakaian: req.body.item_list_status_pemakaian,
      $push: { item_list_history: req.body.item_list_history }
    }
    );

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem tidak ada" });
    }
    const updatedMasterListItemHistory = await master_list_item.findById(id);
    res.status(200).json(updatedMasterListItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedMasterListItemHistoryByName = async (req, res) => {
  try {

    const nama = req.params.nama;
    const MasterListItem = await master_list_item.findOneAndUpdate({ item_list_nama: nama }, {
      // item_list_stok:req.body.item_list_stok,
      item_list_stok: req.body.item_list_stok,
      $push: { item_list_history: req.body.item_list_history },
    }
    );

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem tidak ada" });
    }
    const updatedMasterListItemHistory = await master_list_item.findOne({ item_list_nama: nama });
    res.status(200).json(updatedMasterListItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedMasterListItemtoQC = async (req, res) => {
  try {

    const { id } = req.params;
    const MasterListItem = await master_list_item.findOneAndUpdate(id, {
      // item_list_stok:req.body.item_list_stok,
      // item_list_stok: req.body.item_list_stok,
      $push: { item_list_qc: req.body.item_list_qc },
    }
    );

    if (!MasterListItem) {
      return res.status(404).json({ message: "MasterListItem tidak ada" });
    }
    const updatedMasterListItemHistory = await master_list_item.findOne({ item_list_nama: nama });
    res.status(200).json(updatedMasterListItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Trial dari tr logistik ke master item 
const updatedMasterListItemHistoryByNametrial = async (req, res) => {
  try {
    // const { id } = req.params;
    for (let i = 0; i < req.body.panjang_item; i++) {
      // const element = array[i];
      var hitung_panjang = i

    }
    const nama = req.params.nama;
    const MasternewItem = await master_list_item.findOne({ item_list_nama: nama });
    return MasternewItem.forEach(data => {
      res.json(data)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMasterListItem,
  getMasterListItemid,
  getMasterListItemName,
  createMasterListItem,
  createMasterListItemGambar,
  updateMasterListItem,
  updateMasterByName,
  updateMasterListItemStok,
  updatedMasterListItemHistory,
  updatedMasterListItemHistoryByName,
  updatedMasterListItemtoQC,
  // Trial 
  updatedMasterListItemHistoryByNametrial
};
