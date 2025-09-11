const express = require("express");
const router = express.Router();
const GradingController = require("../../controllers/Grading/Grading.Controller");
// GET
router.get(
  "/getgradinglist/:domain",
  GradingController.getGradingByCompanyName
);
router.get("/getgradingbyid/:id", GradingController.getGradingById);

// Create
router.post("/creategrading", GradingController.createGrading);
router.put("/updategrading/:id", GradingController.updateGrading);

module.exports = router;
