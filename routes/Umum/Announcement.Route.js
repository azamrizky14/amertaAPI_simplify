const express = require("express");
const multer = require("multer");
const router = express.Router();
const AnnouncementController = require("../../controllers/Umum/Announcement.Controller");

// GET
router.get("/getAnnouncement/:domain/:hierarchy/:deleted?", AnnouncementController.getAnnouncement);
router.get("/getAnnouncementCategory/:domain/:hierarchy/:kategori/:deleted?", AnnouncementController.getAnnouncementByKategori);

router.get("/getAnnouncementPrefix/:type/:date", AnnouncementController.getAnnouncementPrefix);
router.get("/getAnnouncementById/:id", AnnouncementController.getAnnouncementById);

// POST
router.post("/createAnnouncement", AnnouncementController.createAnnouncement);

// UPDATE
router.put("/updateAnnouncement/:id", AnnouncementController.updateAnnouncement);



// update a product





module.exports = router;