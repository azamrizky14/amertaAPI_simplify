const express = require("express");
const multer = require("multer");

const TrQc = require("../models/Tr_qc.model.js");
const router = express.Router();
const
    {
        getTrQc,
        getTrQcById,
        createTrQc,
        createTrQcGambar,
        updateTrQc,
        updatedTrQcTahap
    } = require('../controllers/Tr_qc.controller.js');
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


router.get("/TrQc/getdata/:domain", getTrQc);
router.get("/TrQc/getbyid/:id", getTrQcById);

router.post("/TrQc/create", createTrQc);
router.post("/TrQc/createimage", upload.fields([{ name: 'Tr_qc_before', maxCount: 1 }, { name: 'Tr_qc_after', maxCount: 1 }]), createTrQcGambar);


// update a product
router.put("/TrQc/updatebyid/:id", updateTrQc);
router.put("/TrQc/updatebyTahap/:id", updatedTrQcTahap);





module.exports = router;