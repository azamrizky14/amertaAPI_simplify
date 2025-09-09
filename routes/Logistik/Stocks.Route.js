const express = require("express");

const router = express.Router();
const Stock = require('../../controllers/Logistik/Stock.Controller.js');
const itemController = require("../../controllers/Umum/Item.Controller");
const StocksController = require("../../controllers/Logistik/Stock.Aggregate.Controller.js");

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
router.get("/getAllStockTotalInOutGraph/:domain/:hierarchy/:deleted?", itemController.getMasterItemWithInOutAnnual);


router.post("/updateNewStockDetail", itemController.updateNewItemDetail);
router.post("/updateStockDetail", itemController.upsertEvidentItemDetail);

router.put("/updateBonMaterialItemDetail", itemController.updateBonMaterialItemDetail);
router.put("/updateEvidentStockDetail", itemController.updateEvidentItemDetail);
router.put("/updateReturItemDetail", itemController.updateReturItemDetail);
router.put("/updateClosingMaterialItemDetail", itemController.updateClosingMaterialItemDetail);
router.put("/updateCurrentStockDetail", itemController.updateCurrentItemDetail);



// AGREGATE 
router.get("/StocksOpnameAsetAgregate/:companyName", StocksController.StockOpnameAgregateAllAset)
router.get("/StockHistoriesInOut", StocksController.StockHistoriesInOut)

module.exports = router;