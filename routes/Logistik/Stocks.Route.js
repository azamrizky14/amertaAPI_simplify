const express = require("express");

const router = express.Router();
const Stock = require('../../controllers/Logistik/Stock.Controller.js');
const itemController = require("../../controllers/Umum/Item.Controller");

// Stock History
router.get("/StockSh/getdata/:domain/:hierarchy", Stock.getStockSh);
router.get("/StockSh/getDataByLocation/:domain/:hierarchy/:location?", Stock.getStockSummaryByLocation);

router.post("/StockSh/create", Stock.createStockSh);

// Stock Opname
router.get("/StockSo/getdata/:domain/:hierarchy", Stock.getStockSo);
router.get("/StockSo/getdataById/detail/:id", Stock.getStockSoDetail);
router.get("/StockSo/getDataForSO/:domain/:hierarchy", Stock.getStockSummaryForSO);
router.get("/StockSo/getSoPrefix/:date", Stock.getSoPrefix);

router.post("/StockSo/createSo", Stock.createSo);

// Stock Items
router.get("/getStockByLocation/:domain/:hierarchy/:location/:deleted?", itemController.getMasterItemByLocation);
router.get("/getAllStockWithLocation/:domain/:hierarchy", itemController.getAllMasterItemWithLocation);
router.get("/getAllStockTotalInOut/:domain/:hierarchy/:deleted?", itemController.getMasterItemWithInOutSummarySafe);


router.post("/updateNewStockDetail", itemController.updateNewItemDetail);
router.put("/updateEvidentStockDetail", itemController.updateEvidentItemDetail);
router.put("/updateBonMaterialItemDetail", itemController.updateBonMaterialItemDetail);

router.put("/updateCurrentStockDetail", itemController.updateCurrentItemDetail);

module.exports = router;