const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataDrafterController = require("../../controllers/Umum/DataDrafter.Controller");
// GET
router.get("/getDataDrafter/:domain/:hierarchy/:deleted?", DataDrafterController.getDataDrafter);
router.get("/getDataDrafterById/:id", DataDrafterController.getDataDrafterById);
router.post("/getDataDrafterByServer/:domain/:hierarchy/:deleted?", DataDrafterController.getDataDrafterByServer);
router.get("/getDataDrafterByType/:domain/:hierarchy/:deleted/:server", DataDrafterController.getDataDrafterByType);

// POST
router.post("/createDataDrafter", DataDrafterController.createDataDrafter);

// UPDATE
router.put("/updateDataDrafter/:id",DataDrafterController.updateDataDrafter);



// update a product







module.exports = router;