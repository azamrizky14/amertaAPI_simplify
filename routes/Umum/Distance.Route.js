const express = require("express");
const multer = require("multer");
const router = express.Router();
const DistanceDrafterController = require("../../controllers/Umum/DistanceDrafter.Controller");

router.get("/distance", DistanceDrafterController.Distance);
router.get("/distancewithdb/:fromid/:toid", DistanceDrafterController.DistanceWithDB);



module.exports = router;