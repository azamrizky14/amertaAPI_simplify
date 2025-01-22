// userInternalRoutes.js
const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
// Define routes and map them to controller methods

// GET ROUTER
router.get("/", roleController.getAllRole);
router.get("/:sortOrder", roleController.getSortedRole) // sortOrder value is "up" and "down" only
router.get("/roleInternal/:hierarchyCode", roleController.getAllRoleInternal);
router.get("/roleExternal/:hierarchyCode", roleController.getAllRoleExternal);

// POST ROUTER

// PUT ROUTER

// Add more routes as needed

module.exports = router;
