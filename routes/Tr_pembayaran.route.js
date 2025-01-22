const express = require("express");
const multer = require("multer");

const Trpembayaran = require("../models/Tr_pembayaran.model.js");
const router = express.Router();
const {
    getTrpembayaran,
    getTrpembayaranbystatusbayar,
    getTrpembayaranById,
    createTrpembayaran,
    createTrpembayaranGambar,
    updateTrpembayaran,
    updatedTrpembayaranTahap
} = require('../controllers/Tr_pembayaran.controller.js');
// / Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, '../admin_logistik/public/images') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-LOGISTIK-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
    // ----


router.get("/Trpembayaran/getdata/:domain", getTrpembayaran);
router.get("/Trpembayaran/getbystatusbayar/:domain/:status", getTrpembayaranbystatusbayar);

router.get("/Trpembayaran/getbyid/:id", getTrpembayaranById);

router.post("/Trpembayaran/create", createTrpembayaran);
router.post("/Trpembayaran/createimage", upload.fields([{ name: 'Tr_pembayaran_before', maxCount: 1 }, { name: 'Tr_pembayaran_after', maxCount: 1 }]), createTrpembayaranGambar);

// update a product
router.put("/Trpembayaran/updatebyid/:id", updateTrpembayaran);
router.put("/Trpembayaran/updatebyTahap/:id", updatedTrpembayaranTahap);





module.exports = router;