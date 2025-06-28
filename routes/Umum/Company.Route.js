// userInternalRoutes.js
const express = require("express");
const router = express.Router();
const companyController = require("../../controllers/Umum/Company.Controller");

const upload = require('../../utils/multerConfig'); // Adjust the path as necessary

// Define routes and map them to controller methods

// GET ROUTER
router.get("/", companyController.getAllDomain);
router.get("/detail/:_id", companyController.getCompanyById);
router.get("/detailByCode/:code", companyController.getCompanyByCode);
router.get("/detailFilter/:fields/:_id", companyController.getCompanyById);

// POST ROUTER
router.post("/create", upload.single('companyLogo'), companyController.createCompany)
router.post("/listBycompanyCode", companyController.listBycompanyCode);

// PUT ROUTER
router.put("/update/:_id", upload.single('companyLogo'), companyController.updateCompany)

// Add more routes as needed

module.exports = router;
