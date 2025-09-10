const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataTipeController = require("../../controllers/Umum/DataTipe.Controller");

router.get("/getDataTipe/:domain/:hierarchy/:deleted?", DataTipeController.getDataTipe);
router.get("/getDataTipeByFilter", DataTipeController.getDataTipeByFilter);
router.get("/getDataTipeById/:id", DataTipeController.getDataTipeById);

// POST
router.post("/createDataTipe", DataTipeController.createDataTipe);

// UPDATE
router.put("/updateDataTipe/:id",DataTipeController.updateDataTipe);







module.exports = router;