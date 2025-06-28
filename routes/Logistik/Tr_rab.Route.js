const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrRabController = require("../../controllers/Logistik/Tr_rab.Controller");

// GET
router.get("/getRab/:domain/:hierarchy/:deleted?", TrRabController.getTrRab);
router.get("/getRabCategory/:domain/:hierarchy/:kategori/:deleted?", TrRabController.getTrRabByKategori);

router.get("/getRabById/:id", TrRabController.getTrRabById);

// POST
router.post("/createRab", TrRabController.createTrRab);

// UPDATE
router.put("/updateRab/:id", TrRabController.updateTrRab);



// update a product





module.exports = router;