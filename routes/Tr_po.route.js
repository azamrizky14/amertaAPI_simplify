const express = require("express");

const router = express.Router();
const {
    getTrPo,
    getTrPoById,
    createTrPo,
    updateTrPo,
    getPoPrefix,
    getTrPoEvident
} = require('../controllers/Tr_po.controller.js');

router.get("/TrPo/getdata/:domain/:deleted?/:status?", getTrPo);
router.get("/TrPo/getdataEvident/:domain/:deleted?/:type?/:status?", getTrPoEvident);
router.get("/TrPo/getDataById/:id", getTrPoById);
router.get("/TrPo/getPoPrefix/:date", getPoPrefix);

router.post("/TrPo/create", createTrPo);

// update a product
router.put("/TrPo/updatebyid/:id", updateTrPo);





module.exports = router;