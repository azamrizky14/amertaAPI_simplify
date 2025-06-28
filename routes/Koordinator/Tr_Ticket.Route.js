const express = require("express");
const multer = require("multer");
const router = express.Router();
const TrTicketController = require("../../controllers/Koordinator/Tr_Ticket.Controller");

// GET
router.get("/getTrTicket/:domain/:hierarchy/:deleted?", TrTicketController.getTrTicket);
router.get("/getTrTicketByDivisi/:domain/:hierarchy/:kategori/:deleted?", TrTicketController.getTrTicketByKategori);
router.get("/getTrTicketByTeknisi/:domain/:hierarchy/:name/:deleted?", TrTicketController.getTrTicketByTeknisi);
router.get("/getTrTicketByUpdated/:domain/:hierarchy/:type/:tgl/:deleted?", TrTicketController.getTrTicketByTrUpdatedHarian);

router.get("/getTrTicketById/:id", TrTicketController.getTrTicketById);
router.get("/getTicketPrefix/:type/:date", TrTicketController.getTicketPrefix);

// POST
router.post("/createTrTicket", TrTicketController.createTrTicket);

// UPDATE
router.put("/updateTrTicket/:id", TrTicketController.updateTrTicket);
router.put("/updateTrTicketHistory/:id", TrTicketController.updateTrTicketHistory);



// update a product





module.exports = router;