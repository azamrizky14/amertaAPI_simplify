const express = require("express");
const multer = require("multer");
const fs = require("fs");

// Multer storage TEMP GENERAL
const storageTempGeneral = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/temp'); // tetap simpan ke temp folder
    },
    filename: function (req, file, cb) {
        // Cek kalau req.params.location ada
        const location = req.params.location 
            ? '-' + req.params.location.toUpperCase() + '-' 
            : '-TEMP-';
        cb(null, Date.now() + location + file.originalname);
    }
});

const uploadTempGeneral = multer({ storage: storageTempGeneral });

const router = express.Router();
const Image = require('../../controllers/Umum/Image.Controller.js');


// General

// Route Upload General
router.post("/uploadTempImage/:location?", uploadTempGeneral.single('image'), Image.uploadImage);
router.post("/moveTempImage", Image.moveTempImage);
router.post("/removeTempImage", Image.removeTempImage);

router.post("/moveMultiTempImage", Image.moveMultipleTempImages);
router.post("/removeMultiTempImage", Image.removeMultipleTempImages);

module.exports = router;