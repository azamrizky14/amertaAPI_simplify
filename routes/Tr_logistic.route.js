const express = require("express");
const multer = require("multer");
const TrLogistic = require("../models/Tr_logistic.model.js");
const router = express.Router();
const {
    getTrLogistics, 
    getTrLogistic, 
    createTrLogistic, 
    createTrLogisticGambar, 
    updateTrLogistic,
    updatedTrLogisticStatustiba, 
    updateTrLogisticGambar,
    updatedTrLogisticTransaksiDibatalkan, 
    getTrLogisticsBulan,
    deleteTrLogistic
} = require('../controllers/Tr_logistic.controller.js');
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

router.get("/TrLogistic/getdata/:domain", getTrLogistics);
router.get("/TrLogistic/getbyid/:id", getTrLogistic);
router.post("/TrLogistic/getbyidtanggal/:domain/:tanggal", getTrLogisticsBulan);


router.post("/TrLogistic/create", createTrLogistic);
router.post("/TrLogistic/creategambar",upload.single('Tr_logistic_gambar'),createTrLogisticGambar)

// update a product
router.put("/TrLogistic/updatebyid/:id", updateTrLogistic);
router.put("/TrLogistic/updatebyidStatusTiba/:id", updatedTrLogisticStatustiba);
router.put("/TrLogistic/updatebyidgambar/:id", updateTrLogisticGambar);
router.put("/TrLogistic/updatebyidTransaksiDibatalkan/:id", updatedTrLogisticTransaksiDibatalkan);


// delete a product
router.delete("/TrLogistic/deletebyid/:id", deleteTrLogistic);




module.exports = router;