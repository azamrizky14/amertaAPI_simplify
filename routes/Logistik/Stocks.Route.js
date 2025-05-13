const express = require("express");

const router = express.Router();
const Stock = require('../../controllers/Logistik/Stock.Controller.js');

// Stock History
router.get("/StockSh/getdata/:domain/:hierarchy", Stock.getStockSh);
router.get("/StockSh/getDataByLocation/:domain/:hierarchy/:location?", Stock.getStockSummaryByLocation);

router.post("/StockSh/create", Stock.createStockSh);

// Stock Opname
router.get("/StockSo/getdata/:domain/:hierarchy", Stock.getStockSo);
router.get("/StockSo/getdata/detail/:id", Stock.getStockSoDetail);
router.get("/StockSo/getDataForSO/:domain/:hierarchy", Stock.getStockSummaryForSO);
router.get("/StockSo/getSoPrefix/:date", Stock.getSoPrefix);

router.post("/StockSo/createSo", Stock.createSo);

module.exports = router;