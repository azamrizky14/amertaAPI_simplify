const express = require("express");
const router = express.Router();
const locationController = require("../../controllers/Umum/Location.Controller.js");


// GET
router.get("/getAllLocation/:domain/:hierarchy/:deleted?", locationController.getMasterLocation);
router.get("/getLocationById/:id", locationController.getMasterLocationId);
router.get('/getLocationByType/:company/:jenis/:alamat?', locationController.getLocationByTipe);

// POST
router.post("/create", locationController.createMasterLocation);


// UPDATE
router.put("/update/:id", locationController.updateMasterLocation);

// update a product






module.exports = router;