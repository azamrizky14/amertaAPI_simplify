const express = require("express");
const multer = require("multer");
const Location = require("../models/locationModels.js");
const router = express.Router();
const locationController = require("../controllers/locationController.js");
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/master_lokasi') // Destinasi didalam project back end
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-LOGISTIK-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// GET
router.get("/getAllLocation/:domain/:deleted?", locationController.getMasterLocation);
router.get("/getLocationById/:id", locationController.getMasterLocationId);
router.get('/getLocationByType/:company/:jenis/:alamat?', locationController.getLocationByTipe);

// POST
router.post("/create", locationController.createMasterLocation);


// UPDATE
router.put("/update/:id", locationController.updateMasterLocation);


// update a product







module.exports = router;