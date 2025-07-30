const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataCoaController = require("../../controllers/Keuangan/DataCoa.Controller");

// GET
router.get("/getDataCoa/:domain/:hierarchy/:deleted?", DataCoaController.getDataCoa);
router.get("/getDataCoaByKodeAkun/:akun/:deleted", DataCoaController.getDataCoaByKodeAkun);

router.get("/getDataCoaById/:id", DataCoaController.getDataCoaById);

// POST
router.post("/createDataCoa", DataCoaController.createDataCoa);

// UPDATE
router.put("/updateDataCoa/:id", DataCoaController.updateDataCoa);



// update a product





module.exports = router;