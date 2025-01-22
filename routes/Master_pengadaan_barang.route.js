const express = require("express");
const MasterPengadaanBarang = require("../models/Master_pengadaan_barang.model.js");
const router = express.Router();
const {getMasterPengadaanBarang, getMasterPengadaanBarangid, createMasterPengadaanBarang, updateMasterPengadaanBarang,updateMasterPengadaanBarangStok,updatedMasterPengadaanBarangHistory} = require('../controllers/Master_pengadaan_barang.controller.js');


router.get("/MasterPengadaanBarang/getdata/:domain", getMasterPengadaanBarang);
router.get("/MasterPengadaanBarang/getbyid/:id", getMasterPengadaanBarangid);

router.post("/MasterPengadaanBarang/create", createMasterPengadaanBarang);

// update a product
router.put("/MasterPengadaanBarang/updatebyid/:id", updateMasterPengadaanBarang);
router.put("/MasterPengadaanBarang/updatebyidItemStok/:id", updateMasterPengadaanBarangStok);
router.put("/MasterPengadaanBarang/updatebyidItemHistory/:id", updatedMasterPengadaanBarangHistory);




module.exports = router;