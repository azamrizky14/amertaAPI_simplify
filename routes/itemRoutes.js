const express = require("express");
const multer = require("multer");
const Item = require("../models/itemModels.js");
const router = express.Router();
const itemController = require("../controllers/itemController");
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/master_item') // Destinasi didalam project back end
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-LOGISTIK-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// GET
router.get("/getAllItem/:domain/:deleted?", itemController.getMasterItem);
router.get("/getItemById/:id", itemController.getMasterItemId);

// POST
router.post("/createImage", upload.any(), itemController.createMasterItemGambar);

// UPDATE
router.put("/updateImage/:id", upload.any(), itemController.updateMasterItemGambar);



// update a product







module.exports = router;