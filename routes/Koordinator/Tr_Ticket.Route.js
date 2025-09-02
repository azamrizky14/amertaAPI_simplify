const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrTicketController = require("../../controllers/Koordinator/Tr_Ticket.Controller");

// GET
router.get("/getTrTicket/:domain/:deleted?", TrTicketController.getTrTicket);
router.get("/getTrTicketByDivisi/:domain/:kategori", TrTicketController.getTrTicketByKategori);
router.get("/getTrTicketByTeknisi/:domain/:name/:deleted?", TrTicketController.getTrTicketByTeknisi);
router.get("/getTrTicketByUpdated/:domain/:type/:tgl/:deleted?", TrTicketController.getTrTicketByTrUpdatedHarian);

router.get("/getTrTicketById/:id", TrTicketController.getTrTicketById);
router.get("/getTicketPrefix/:type/:date", TrTicketController.getTicketPrefix);

// POST
router.post("/createTrTicket", TrTicketController.createTrTicket);

// UPDATE
router.put("/updateTrTicket/:id", TrTicketController.updateTrTicket);
router.put("/updateTrTicketHistory/:id", TrTicketController.updateTrTicketHistory);



// update a product





module.exports = router;