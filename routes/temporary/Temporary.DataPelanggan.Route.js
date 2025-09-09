const express = require("express");
const router = express.Router();
const TemporaryDataPelanggan = require("../../controllers/temporary/Temporary.DataPelanggan.Controller");

// GET
router.get("/tempdatapelanggan/:cabang", TemporaryDataPelanggan.getTemporaryDataPelanggan);
router.get("/tempdatapelangganbyid/:id", TemporaryDataPelanggan.getTemporaryDataPelangganById);
router.get("/tempdatapelangganbycatatan/:note",TemporaryDataPelanggan.getTemporaryDataPelangganByCatatan);
router.get("/tempdatapelangganbysn/:serial", TemporaryDataPelanggan.getTemporaryDataPelangganBySN)

// POST
router.post("/createtempdatapelanggan", TemporaryDataPelanggan.createTemporaryDataPelanggan);

// UPDATE
router.put("/updatetempdatapelanggan/:id",TemporaryDataPelanggan.updateTemporaryDataPelanggan);







module.exports = router;