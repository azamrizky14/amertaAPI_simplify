const express = require("express");
const MasterHargaMaterial = require("../models/Master_harga_material.model.js");
const router = express.Router();
const {getMasterHargaMaterial, getMasterHargaMaterialid, createMasterHargaMaterial, updateMasterHargaMaterial,updateMasterHargaMaterialStok,updatedMasterHargaMaterialHistory} = require('../controllers/Master_harga_material.controller.js');


router.get("/MasterHargaMaterial/getdata/:domain", getMasterHargaMaterial);
router.get("/MasterHargaMaterial/getbyid/:id", getMasterHargaMaterialid);

router.post("/MasterHargaMaterial/create", createMasterHargaMaterial);

// update a product
router.put("/MasterHargaMaterial/updatebyid/:id", updateMasterHargaMaterial);
router.put("/MasterHargaMaterial/updatebyidItemStok/:id", updateMasterHargaMaterialStok);
router.put("/MasterHargaMaterial/updatebyidItemHistory/:id", updatedMasterHargaMaterialHistory);




module.exports = router;