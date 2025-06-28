const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrTaskController = require("../../controllers/Koordinator/Tr_Task.Controller");

// GET
router.get("/getTrTask/:domain/:hierarchy/:deleted?", TrTaskController.getTrTask);
router.get("/getTrTaskByDivisi/:domain/:hierarchy/:division/:deleted?", TrTaskController.getTrTaskByDivisi);
router.get("/getTrTaskByTeknisi/:domain/:hierarchy/:name/:deleted?", TrTaskController.getTrTaskByTeknisi);
router.get("/getTrTaskListPekerjaan/:job", TrTaskController.getTrTaskPekerjaanByTrTask);

router.get("/getTrTaskById/:id", TrTaskController.getTrTaskById);
router.get("/getTaskPrefix/:type/:date", TrTaskController.getTaskPrefix);

// POST
router.post("/createTrTask", TrTaskController.createTrTask);

// UPDATE
router.put("/updateTrTask/:id", TrTaskController.updateTrTask);



// update a product





module.exports = router;