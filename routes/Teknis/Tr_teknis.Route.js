const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
    getTrTeknis,
    getTrTeknisById,
    getTrTeknisEvidentById,
    getTrTeknisEvidentByMonth,
    createTrTeknis,
    createTrTeknisGambar,
    updateTrTeknisWorkOrderTerpakai,
    updateTrTeknis,
    updateTrTeknisGambar,
    updateTrTeknisEvidentById,
    getBonPrefix,
    getAllWorkOrders,
    getTrTeknisEvident
} = require('../../controllers/Teknis/Tr_teknis.Controller.js');
// / Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/admin_logistik') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-TEKNIS-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
    // ----

router.get("/Trteknis/getTotalData/:domain/:hierarchy/:type/:month?", getAllWorkOrders);
router.get("/Trteknis/getdata/:domain/:hierarchy/:deleted?/:type?/:status?", getTrTeknis);
router.get("/Trteknis/getdataEvident/:domain/:hierarchy/:deleted?/:type?/:status?", getTrTeknisEvident);
router.get("/Trteknis/getdataEvidentByMonth/:domain/:hierarchy/:deleted?/:type?/:month?", getTrTeknisEvidentByMonth);
router.get("/Trteknis/getbyid/:id", getTrTeknisById);
router.get("/Trteknis/getEvidentbyid/:logistikType/:logistikdate/:logistikNumber/:id", getTrTeknisEvidentById);
router.get("/Trteknis/getBonPrefix/:type/:date/:domain", getBonPrefix); 

router.post("/Trteknis/create", createTrTeknis);
router.post("/Trteknis/createimage", upload.any(), createTrTeknisGambar);

// update a product
router.put("/Trteknis/updatebyid/:id", updateTrTeknis);
router.put("/Trteknis/updateImageById/:id", upload.any(), updateTrTeknisGambar);
router.put("/Trteknis/updateWorkOrder", upload.any(), updateTrTeknisWorkOrderTerpakai);
router.put("/Trteknis/updateEvidentbyid/:logistikType/:logistikdate/:logistikNumber/:id", upload.any(), updateTrTeknisEvidentById);





module.exports = router;