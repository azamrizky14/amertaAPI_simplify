const express = require("express");
const multer = require("multer");
const router = express.Router();
const OltController = require("../../controllers/Noc/Olt.Controller");

// GET
router.get("/getDataOlt/:companyName", OltController.getOlt);
router.get("/getOltById/:id", OltController.getOltById);
// POST
router.post("/createDataOlt", OltController.createOlt);
// UPDATE
router.put("/updateDataOlt/:id", OltController.updateOlt);



module.exports = router;
