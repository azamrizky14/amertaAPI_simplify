const express = require("express");
const multer = require("multer");

const router = express.Router();
const TrTeknis = require('../../controllers/Teknis/Tr_teknis.Controller.js');
const TrTeknisAgregate = require('../../controllers/Teknis/Tr_teknis.Agregate.Controller.js')
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
    
router.get("/Trteknis/getTotalDataBulanan/:domain/:hierarchy/:type", TrTeknis.getAllWorkOrders);
router.get("/Trteknis/getMonthlyDataPerYear/:domain/:hierarchy/:type", TrTeknis.getMonthlyDataPerYear);
router.get("/Trteknis/getdata/:domain/:hierarchy/:deleted?/:type?/:status?", TrTeknis.getTrTeknis);
router.get("/Trteknis/getdataEvident/:domain/:hierarchy/:deleted?/:type?/:status?", TrTeknis.getTrTeknisEvident);
router.get("/Trteknis/getdataEvidentByBonAndMonth/:domain/:hierarchy/:deleted?/:type?/:month?", TrTeknis.getTrTeknisEvidentByMonth);
router.get("/Trteknis/getbyid/:id", TrTeknis.getTrTeknisById);
router.get("/Trteknis/getEvidentbyid/:logistikType/:logistikdate/:logistikNumber/:id", TrTeknis.getTrTeknisEvidentById);
router.get("/Trteknis/getBonPrefix/:type/:date/:domain", TrTeknis.getBonPrefix); 

router.post("/Trteknis/create", TrTeknis.createTrTeknis);
router.post("/Trteknis/createimage", upload.any(), TrTeknis.createTrTeknisGambar);

// update a product
router.put("/Trteknis/updatebyid/:id", TrTeknis.updateTrTeknis);
router.put("/Trteknis/updateWorkOrderNonGambar", TrTeknis.updateTrTeknisWorkOrderTerpakaiNonGambar);
router.put("/Trteknis/updateImageById/:id", upload.any(), TrTeknis.updateTrTeknisGambar);
router.put("/Trteknis/updateWorkOrder", upload.any(), TrTeknis.updateTrTeknisWorkOrderTerpakai);
router.put("/Trteknis/updateEvidentbyid/:logistikType/:logistikdate/:logistikNumber/:id", TrTeknis.updateTrTeknisEvidentById);



// Agregations 
router.get("/Trteknis/aggregate/perolehanteknisibyname", TrTeknisAgregate.TrTeknisAgregatePerolehanTeknisi);
router.get("/Trteknis/aggregate/listperolehanteknisi",TrTeknisAgregate.TrTeknisAgregateListPerolehanTeknisi)
router.get("/Trteknis/aggregate/listdurasipenyelesaianAVG",TrTeknisAgregate.TrTeknisAgregateListDurasiPenyelesaianAVG)





module.exports = router;