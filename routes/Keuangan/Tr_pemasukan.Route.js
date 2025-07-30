const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrPemasukanController = require("../../controllers/Keuangan/Tr_pemasukan.Controller");

// GET
router.get("/getTrPemasukan/:domain/:hierarchy/:deleted?", TrPemasukanController.getTrPemasukan);
router.get("/getTrPemasukanByInvoice/:invoice/:deleted", TrPemasukanController.getTrPemasukanByInvoice);
router.get("/getTrPemasukanById/:id", TrPemasukanController.getTrPemasukanById);

// POST
router.post("/createTrPemasukan", TrPemasukanController.createTrPemasukan);

// UPDATE
router.put("/updateTrPemasukan/:id", TrPemasukanController.updateTrPemasukan);



// update a product





module.exports = router;