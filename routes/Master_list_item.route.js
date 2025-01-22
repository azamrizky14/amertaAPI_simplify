const express = require("express");
const MasterListItem = require("../models/Master_list_item.model.js");
const router = express.Router();
const {
    getMasterListItem, 
    getMasterListItemid,
    getMasterListItemName, 
    createMasterListItem,
    createMasterListItemGambar,
    updateMasterByName, 
    updateMasterListItem,
    updateMasterListItemStok,
    updatedMasterListItemHistory,
    updatedMasterListItemHistoryByName, 
    updatedMasterListItemtoQC,
    updatedMasterListItemHistoryByNametrial} = require('../controllers/Master_list_item.controller.js');


router.get("/MasterListItem/getdata/:domain", getMasterListItem);
router.get("/MasterListItem/getbyid/:id", getMasterListItemid);
router.get("/MasterListItem/getbyname/:name", getMasterListItemName);


router.post("/MasterListItem/create", createMasterListItem);
router.post("/MasterListItem/createimage", createMasterListItemGambar);



// update a product
router.put("/MasterListItem/updatebyname/:nama",updateMasterByName )
router.put("/MasterListItem/updatebyid/:id", updateMasterListItem);
router.put("/MasterListItem/updatebyidItemStok/:id", updateMasterListItemStok);
router.put("/MasterListItem/updatebyidItemHistory/:id", updatedMasterListItemHistory);
router.put("/MasterListItem/updatebyidItemHistoryByName/:nama", updatedMasterListItemHistoryByName);
router.put("/MasterListItem/updatebyidItemtoqc/:id",updatedMasterListItemtoQC)

// Trial 
router.put("/trial/updatebyname/:nama",updatedMasterListItemHistoryByNametrial)





module.exports = router;