const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrCrmController = require("../../controllers/Pelayanan/Tr_Crm.Controller");

// GET
router.get("/getTrCrm/:domain/:hierarchy/:deleted?", TrCrmController.getTrCrm);
router.get("/getTrCrmById/:id", TrCrmController.getTrCrmById);
router.get("/getTrCrmByKategori/:domain/:hierarchy/:kategori/:deleted?", TrCrmController.getTrCrmByKategori);

router.get("/getTrCrmPrefix/:type/:date", TrCrmController.getTrCrmPrefix);
// POST
router.post("/createTrCrm", TrCrmController.createTrCrm);
// UPDATE
router.put("/updateTrCrm/:id", TrCrmController.updateTrCrm);



module.exports = router;