const Master_pengadaan_barang = require("../models/Master_pengadaan_barang.model");

// GET BY DOMAIN
const getMasterPengadaanBarang = async (req, res) => {
  try {
    const MasterPengadaanBarang = await Master_pengadaan_barang.find({master_pengadaan_barang_domain:req.params.domain, master_pengadaan_barang_status:"Y"});
    res.status(200).json(MasterPengadaanBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getMasterPengadaanBarangid = async (req, res) => {
  try {
    const { id } = req.params;
    const MasterPengadaanBarang = await Master_pengadaan_barang.findById(id);
    res.status(200).json(MasterPengadaanBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createMasterPengadaanBarang = async (req, res) => {
  try {
    const MasterPengadaanBarang = await Master_pengadaan_barang.create(req.body);
    res.status(200).json(MasterPengadaanBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated MasterPengadaanBarang 
const updateMasterPengadaanBarang = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterPengadaanBarang = await Master_pengadaan_barang.findByIdAndUpdate(id, req.body);

    if (!MasterPengadaanBarang) {
      return res.status(404).json({ message: "MasterPengadaanBarang not found" });
    }

    const updatedMasterPengadaanBarang = await Master_pengadaan_barang.findById(id);
    res.status(200).json(updatedMasterPengadaanBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATED MASTER ITEM STOK 
const updateMasterPengadaanBarangStok = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterPengadaanBarang = await Master_pengadaan_barang.findByIdAndUpdate(id, {
      item_stok:req.body.item_stok
    });

    if (!MasterPengadaanBarang) {
      return res.status(404).json({ message: "MasterPengadaanBarang not found" });
    }

    const updatedMasterPengadaanBarang = await Master_pengadaan_barang.findById(id);
    res.status(200).json(updatedMasterPengadaanBarang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Updated Master Item ngambil item history
const updatedMasterPengadaanBarangHistory = async(req,res) =>{
  try {
    const {id} = req.params;
    const MasterPengadaanBarang = await Master_pengadaan_barang.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      item_stok:req.body.item_stok,
      $push:{item_history:req.body.item_history}}
      );

    if(!MasterPengadaanBarang){
      return res.status(404).json({ message:"MasterPengadaanBarang tidak ada"});
    }
    const updatedMasterPengadaanBarangHistory = await Master_pengadaan_barang.findById(id);
    res.status(200).json(updatedMasterPengadaanBarangHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getMasterPengadaanBarang,
  getMasterPengadaanBarangid,
  createMasterPengadaanBarang,
  updateMasterPengadaanBarang,
  updateMasterPengadaanBarangStok,
  updatedMasterPengadaanBarangHistory
};
