// userExternalRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const userExternalController = require("../../controllers/Umum/UserExternal.Controller");

// / Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/user_external') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-TEKNIS-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// Define routes and map them to controller methods

// GET ROUTER
router.get("/detail/:userId", userExternalController.getUserById);
router.get("/", userExternalController.getAllUsers);
router.get("/getUserByRole/:companyName/:userRole?", userExternalController.getUserByRole);

// POST ROUTER
router.post("/create", upload.single('userImage'), userExternalController.createUser)
router.post("/createOne", userExternalController.createUserOne);
router.post("/login", userExternalController.loginUser);
router.post("/listBycompanyCode", userExternalController.listBycompanyCode);

// PUT ROUTER
router.put("/updateOne/:userId", userExternalController.updateUserOne);
router.put("/update/:_id", upload.single('userImage'), userExternalController.updateUser)
// Add more routes as needed

module.exports = router;
