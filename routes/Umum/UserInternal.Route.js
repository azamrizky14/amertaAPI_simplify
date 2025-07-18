// userInternalRoutes.js
const express = require("express");
const multer = require("multer");
const router = express.Router();
const userInternalController = require("../../controllers/Umum/UserInternal.Controller");
// / Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/user_internal') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-TEKNIS-AMERTA-' + file.originalname)
    }
});
const upload = multer({ storage: storage })
// Define routes and map them to controller methods


// GET ROUTER
router.get("/detail/:userId", userInternalController.getUserById);
router.get("/", userInternalController.getAllUsers);
router.get("/getUserByRole/:domain/:hierarchy/:userRole?", userInternalController.getUserByRole);

// POST ROUTER
router.post("/create", upload.single('userImage'), userInternalController.createUser)
router.post("/createOne", userInternalController.createUserOne);
router.post("/login", userInternalController.loginUser);
router.post("/listBycompanyCode", userInternalController.listBycompanyCode);

// PUT ROUTER
router.put("/updateOne/:userId", userInternalController.updateUserOne);
router.put("/update/:_id", upload.single('userImage'), userInternalController.updateUser)
// Add more routes as needed

module.exports = router;
