const express = require("express");
const multer = require("multer");
const router = express.Router();
const CronjobController = require("../../controllers/cronjobcontroller/Cronjob.Controller");
// GET
router.get("/getCronjob/:domain/:hierarchy/:deleted?", CronjobController.getCronjob);
router.get("/getCronjobById/:id", CronjobController.getCronjobById);

// POST
router.post("/createCronjob", CronjobController.createCronjob);

// UPDATE
router.put("/updateCronjob/:id",CronjobController.updateCronjob);

module.exports = router;