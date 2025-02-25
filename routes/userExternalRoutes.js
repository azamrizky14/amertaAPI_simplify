// userExternalRoutes.js
const express = require("express");
const router = express.Router();
const userExternalController = require("../controllers/userExternalController");
const upload = require('../utils/multerConfig'); // Adjust the path as necessary
// Define routes and map them to controller methods

// GET ROUTER
router.get("/detail/:userId", userExternalController.getUserById);
router.get("/", userExternalController.getAllUsers);
router.get("/getUserByRole/:companyName/:userRole?", userExternalController.getUserByRole);

// POST ROUTER
router.post("/create", upload.single('userImage'), userExternalController.createUser)
router.post("/createOne", userExternalController.createUserOne);
router.post("/login", userExternalController.loginUser);
router.post("/listByCompanyCode", userExternalController.listByCompanyCode);

// PUT ROUTER
router.put("/updateOne/:userId", userExternalController.updateUserOne);
router.put("/update/:_id", upload.single('userImage'), userExternalController.updateUser)
// Add more routes as needed

module.exports = router;
