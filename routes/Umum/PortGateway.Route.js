const express = require("express");
const multer = require("multer");
const router = express.Router();
const PortGatewayController = require("../../controllers/Umum/PortGateway.Controller");

router.get("/getPortGateway/:deleted?", PortGatewayController.getPortGateway);
router.get("/getPortGatewayById/:id", PortGatewayController.getPortGatewayById);
router.get("/getPortgatewayPrefix", PortGatewayController.getPortgatewayPrefix);

// POST
router.post("/createPortGateway", PortGatewayController.createPortGateway);

// UPDATE
router.put("/updatePortGateway/:id",PortGatewayController.updatePortGateway);







module.exports = router;