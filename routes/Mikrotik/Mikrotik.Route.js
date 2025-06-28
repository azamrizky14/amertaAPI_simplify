const express = require("express");

const router = express.Router();

const { ConnectMikrotikByid } = require("../../controllers/Mikrotik/Checkping");
const Mikronode = require("../../controllers/Mikrotik/Mikronode");
const MikronodeHard = require("../../controllers/Mikrotik/MikronodeHard")

router.get("/connect/:id", ConnectMikrotikByid);
router.get("/mikronode/:id", Mikronode.getSystemIdentity);


// Hardcode 
router.get("/test", MikronodeHard.testConnection);
router.get("/system", MikronodeHard.getSystemIdentity);

module.exports = router;
