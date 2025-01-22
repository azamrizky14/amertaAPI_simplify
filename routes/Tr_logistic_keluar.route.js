const express = require("express");
const multer = require("multer");
const TrLogisticKeluar = require("../models/Tr_logistic_keluar.model.js");
const router = express.Router();
const {
    getTrLogisticKeluars,
    getTrLogisticKeluarsByType,
    getTrLogisticKeluar,
    createTrLogisticKeluar,
    createTrLogisticKeluarGambar,
    updateTrLogisticKeluar,
    updatedTrLogisticKeluarStatustiba,
    updatedTrLogisticKeluarTransaksiDibatalkan,
    deleteTrLogisticKeluar
} = require('../controllers/Tr_logistic_keluar.controller.js');
// / Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, '../admin_logistik/public/images') // Destinasi didalam project front end
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-LOGISTIK-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// ----

router.get("/TrLogisticKeluar/getdata/:domain", getTrLogisticKeluars);
router.get("/TrLogisticKeluar/getdatatype/:domain/:type", getTrLogisticKeluarsByType);

router.get("/TrLogisticKeluar/getbyid/:id", getTrLogisticKeluar);

router.post("/TrLogisticKeluar/create", createTrLogisticKeluar);
router.post("/TrLogisticKeluar/creategambar", upload.single('Tr_logistic_keluar_gambar'), createTrLogisticKeluarGambar)

// update a product
router.put("/TrLogisticKeluar/updatebyid/:id", updateTrLogisticKeluar);
router.put("/TrLogisticKeluar/updatebyidStatusTiba/:id", updatedTrLogisticKeluarStatustiba);
router.put("/TrLogisticKeluar/updatebyidTransaksiDibatalkan/:id", updatedTrLogisticKeluarTransaksiDibatalkan);


// delete a product
router.delete("/TrLogisticKeluar/deletebyid/:id", deleteTrLogisticKeluar);




module.exports = router;