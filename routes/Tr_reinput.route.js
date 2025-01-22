const express = require("express");
const multer = require("multer");

const Trreinput = require("../models/Tr_reinput.model.js");
const router = express.Router();
const {
    getTrreinput,
    getTrreinputById,
    createTrreinput,
    createTrreinputGambar,
    updateTrreinput,
    updatedTrreinputTahap
} = require('../controllers/Tr_reinput.controller.js');
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


router.get("/Trreinput/getdata/:domain", getTrreinput);
router.get("/Trreinput/getbyid/:id", getTrreinputById);

router.post("/Trreinput/create", createTrreinput);
router.post("/Trreinput/createimage", upload.fields([{ name: 'Tr_reinput_before', maxCount: 1 }, { name: 'Tr_reinput_after', maxCount: 1 }]), createTrreinputGambar);


// update a product
router.put("/Trreinput/updatebyid/:id", updateTrreinput);
router.put("/Trreinput/updatebyTahap/:id", updatedTrreinputTahap);





module.exports = router;