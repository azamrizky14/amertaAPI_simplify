const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataLeadController = require("../../controllers/Pelayanan/Data_Lead.Controller");

// GET
router.get("/getDataLead/:domain/:hierarchy/:deleted?", DataLeadController.getDataLead);
router.get("/getDataLeadById/:id", DataLeadController.getDataLeadById);
router.get("/getDataLeadByStatusLead/:domain/:hierarchy/:statuslead/:deleted?", DataLeadController.getDataLeadBystatuslead);
router.get("/getDataLeadByAfiliasi/:afiliasi", DataLeadController.getDataLeadByAfiliasi);
router.get("/countDataLeadByAfiliasi/:afiliasi", DataLeadController.countDataLeadByAfiliasi);
router.get("/countDataLeadByMonth/:domain/:hierarchy/:deleted", DataLeadController.countDataLeadByMonth);
router.get("/countDataLeadByDate/:domain/:hierarchy/:deleted", DataLeadController.countDataLeadByDate);
router.get("/countDataLeadByAfiliasiandMonth/:afiliasi", DataLeadController.countDataLeadByAfiliasiandMonth);
router.get("/countDataLeadByAfiliasiandDate/:afiliasi", DataLeadController.countDataLeadByAfiliasiandDate);

router.get("/getDataLeadPrefix/:type/:date", DataLeadController.getDataLeadPrefix);
// POST
router.post("/createDataLead", DataLeadController.createDataLead);
// UPDATE
router.put("/updateDataLead/:id", DataLeadController.updateDataLead);



module.exports = router;