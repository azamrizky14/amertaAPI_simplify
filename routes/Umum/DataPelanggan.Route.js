const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataPelangganController = require("../../controllers/Umum/DataPelanggan.Controller");

// GET
router.get("/getDataPelanggan/:domain/:deleted?", DataPelangganController.getDataPelanggan);
router.get("/getDataPelangganById/:id", DataPelangganController.getDataPelangganById);
router.get("/getDataPelangganByIdPelanggan/:id/:domain", DataPelangganController.getDataPelangganByIdPelanggan);
router.get("/getDataPelangganPrefix", DataPelangganController.getDataPelangganPrefix);

// POST
router.post("/createDataPelanggan", DataPelangganController.createDataPelanggan);

// UPDATE
router.put("/updateDataPelanggan/:id",DataPelangganController.updateDataPelanggan);
router.put("/updateDataPelangganKode/:id",DataPelangganController.updateDataPelangganKode);



// update a product







module.exports = router;