// userInternalRoutes.js
const express = require("express");
const router = express.Router();
const utilitiesConntroller = require("../../controllers/Umum/Utilities.Controller");


// Define routes and map them to controller methods

// GET ROUTER
router.get("/", utilitiesConntroller.getAllUtilities);
router.get("/byName/:utilName", utilitiesConntroller.getUtilsByName);

// PORT PAGE

router.post("/dev/page/createPage", utilitiesConntroller.pageCreatePage);

// POST ROUTER

// PUT ROUTER

// Add more routes as needed

module.exports = router;
