const express = require("express");
const multer = require("multer");
const MasterItem = require("../models/Master_item.model.js");
const router = express.Router();
const
    {
        getMasterItem,
        getMasterItemByItemSatuan,
        getMasterItemid,
        getMasterItemName,
        createMasterItem,
        createMasterItemGambar,
        createMasterItemExisting,
        updateMasterByName,
        updateMasterItem,
        updateMasterItemGambar,
        updateMasterItemStok,
        updatedMasterItemHistory,
        updatedMasterItemHistoryPemakaianKabel,
        updatedMasterItemHistoryByName,
        updatedMasterItemList,
        updatedMasterItemHistoryByNametrial
    } = require('../controllers/Master_item.controller.js');
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, '../admin_logistik/public/images') // Destinasi didalam project front end
    },
    filename: function (req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-LOGISTIK-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// ----

router.get("/MasterItem/getdata/:domain", getMasterItem);
router.get("/MasterItem/getdataBySatuan/:domain/:satuan", getMasterItemByItemSatuan);

router.get("/MasterItem/getbyid/:id", getMasterItemid);
router.get("/MasterItem/getbyname/:item_nama", getMasterItemName);


router.post("/MasterItem/create", createMasterItem);
router.post("/MasterItem/createimage", upload.single('item_gambar'), createMasterItemGambar);
router.post("/MasterItem/createExisting/:nama", createMasterItemExisting);


// update a product
router.put("/MasterItem/updatebyname/:nama", updateMasterByName)
router.put("/MasterItem/updatebyid/:id", updateMasterItem);
router.put("/MasterItem/updatebyidgambar/:id", upload.single('item_gambar'), updateMasterItemGambar);

router.put("/MasterItem/updatebyidItemStok/:id", updateMasterItemStok);
router.put("/MasterItem/updatebyidItemStok&HistoryKabel/:id", updatedMasterItemHistoryPemakaianKabel);

router.put("/MasterItem/updatebyidItemHistory/:id", updatedMasterItemHistory);
router.put("/MasterItem/updatebyidItemHistoryByName/:nama", updatedMasterItemHistoryByName);
router.put("/MasterItem/updatebyidItemlist/:id", updatedMasterItemList);


// Trial 
router.put("/trial/updatebyname/:nama", updatedMasterItemHistoryByNametrial)





module.exports = router;