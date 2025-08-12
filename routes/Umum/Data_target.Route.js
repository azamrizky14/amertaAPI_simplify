const express = require("express");
const multer = require("multer");
const router = express.Router();
const DataTargetController = require("../../controllers/Umum/Data_target.Controller");

router.get("/getDataTarget/:deleted?", DataTargetController.getDataTarget);
router.get("/getDataTargetMatchDate/:matchDate?", DataTargetController.getDataTargetMatch);
router.get("/getDataTargetStartEndDate", DataTargetController.getDataTargetStartEndDate);
router.get("/getDataTargetById/:id", DataTargetController.getDataTargetById);
router.get("/getDataTargetByUserId/:id", DataTargetController.getDataTargetBySalesId)

// POST
router.post("/createDataTarget", DataTargetController.createDataTarget);

// UPDATE
router.put("/updateDataTarget/:id",DataTargetController.updateDataTarget);







module.exports = router;