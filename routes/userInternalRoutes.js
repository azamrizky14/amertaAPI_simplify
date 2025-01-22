// userInternalRoutes.js
const express = require("express");
const router = express.Router();
const userInternalController = require("../controllers/userInternalController");
const upload = require('../utils/multerConfig'); // Adjust the path as necessary
// Define routes and map them to controller methods

// GET ROUTER
router.get("/detail/:userId", userInternalController.getUserById);
router.get("/", userInternalController.getAllUsers);
router.get("/getUserByRole/:companyName/:userRole?", userInternalController.getUserByRole);

// POST ROUTER
router.post("/create", upload.single('userImage'), userInternalController.createUser)
router.post("/createOne", userInternalController.createUserOne);
router.post("/login", userInternalController.loginUser);
router.post("/listByCompanyCode", userInternalController.listByCompanyCode);

// PUT ROUTER
router.put("/updateOne/:userId", userInternalController.updateUserOne);
router.put("/update/:_id", upload.single('userImage'), userInternalController.updateUser)
// Add more routes as needed

module.exports = router;
