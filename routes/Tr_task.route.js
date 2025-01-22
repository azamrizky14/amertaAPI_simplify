const express = require("express");
const multer = require("multer");

const Trtask = require("../models/Tr_task.model.js");
const router = express.Router();
const {
    getTrtask,
    getTrtaskById,
    createTrtask,
    createTrtaskGambar,
    updateTrtask,
    updatedTrtaskTahap
} = require('../controllers/Tr_task.controller.js');
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


router.get("/Trtask/getdata/:domain", getTrtask);
router.get("/Trtask/getbyid/:id", getTrtaskById);

router.post("/Trtask/create", createTrtask);
router.post("/Trtask/createimage", upload.fields([{ name: 'Tr_task_before', maxCount: 1 }, { name: 'Tr_task_after', maxCount: 1 }]), createTrtaskGambar);


// update a product
router.put("/Trtask/updatebyid/:id", updateTrtask);
router.put("/Trtask/updatebyTahap/:id", updatedTrtaskTahap);





module.exports = router;