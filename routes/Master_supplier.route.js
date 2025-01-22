const express = require("express");
const MasterSupplier = require("../models/Master_supplier.model.js");
const router = express.Router();
const {getMasterSupplier, getMasterSupplierid, createMasterSupplier, updateMasterSupplier} = require('../controllers/Master_supplier.controller.js');


router.get("/MasterSupplier/getdata", getMasterSupplier);
router.get("/MasterSupplier/getbyid/:id", getMasterSupplierid);

router.post("/MasterSupplier/create", createMasterSupplier);

// update a product
router.put("/MasterSupplier/updatebyid/:id", updateMasterSupplier);


module.exports = router;