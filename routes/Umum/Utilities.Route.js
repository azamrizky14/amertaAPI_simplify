// userInternalRoutes.js
const express = require("express");
const router = express.Router();
const utilitiesConntroller = require("../../controllers/Umum/Utilities.Controller");


// Define routes and map them to controller methods

// GET ROUTER
router.get("/", utilitiesConntroller.getAllUtilities);
router.get("/byName/:utilName", utilitiesConntroller.getUtilsByName);

router.put("/byName/:utilName", utilitiesConntroller.updateUtilsByName);

// PORT PAGE
router.get("/page/getPage/:code", utilitiesConntroller.pageGetByCode);
router.post("/page/createPage", utilitiesConntroller.pageCreatePage);// full replace
router.put("/page/update/:code", utilitiesConntroller.pageUpdateByCode);

// router.patch("/page/:code", utilitiesController.pageUpdateByCode);


// POST ROUTER

// PUT ROUTER

// Add more routes as needed

module.exports = router;
