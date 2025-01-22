const express = require("express");
const multer = require("multer");

const Trclosing = require("../models/Tr_closing.model.js");
const router = express.Router();
const {
    getTrclosing,
    getTrclosingByBulan,
    getTrclosingById,
    createTrclosing,
    createTrclosingGambar,
    updateTrclosing,
    updatedTrclosingTahap
} = require('../controllers/Tr_closing.controller.js');
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


router.get("/Trclosing/getdata/:domain", getTrclosing);
router.get("/Trclosing/getbybulan/:domain/:bulan", getTrclosingByBulan);

router.get("/Trclosing/getbyid/:id", getTrclosingById);

router.post("/Trclosing/create", createTrclosing);
router.post("/Trclosing/createimage", upload.fields([{ name: 'Tr_closing_before', maxCount: 1 }, { name: 'Tr_closing_after', maxCount: 1 }]), createTrclosingGambar);

// update a product
router.put("/Trclosing/updatebyid/:id", updateTrclosing);
router.put("/Trclosing/updatebyTahap/:id", updatedTrclosingTahap);





module.exports = router;