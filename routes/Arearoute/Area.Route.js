const express = require("express");
const router = express.Router();
const AreaController = require("../../controllers/AreaController/Area.Controller");
// GET
router.get("/getarealist/:domain", AreaController.getAreaByCompanyName);
router.get("/getareabyid/:id", AreaController.getAreaById);

// POST
router.post("/createarea", AreaController.createArea);

// PUT
router.put("/updatearea/:id", AreaController.updateArea);

module.exports = router;
