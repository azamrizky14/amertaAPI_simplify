// companyController.js
require('dotenv').config();

// const createUtilitiesModel = require("../models/utilitiesModels");

// let Utilities 
// async function getUtilities() {
//     Utilities = await createUtilitiesModel();
// }  
// getUtilities()

const Utilities = require("../../models/Umum/Utilities.Models");


// Controller method to get all users
async function getAllUtilities(req, res) {
  try {
    // Retrieve all users from the database
    const utilities = await Utilities.find({ isDeleted: "N" });
    res.json(utilities);
  } catch (error) {
    console.error("Error fetching utilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to get all users
async function getUtilsByName(req, res) {
  try {
    const reqUtilName = req.params.utilName
    // Retrieve all users from the database
    const utilities = await Utilities.findOne({ isDeleted: "N", utilName: reqUtilName });
    res.json(utilities);
  } catch (error) {
    console.error("Error fetching utilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to add a new page
async function pageCreatePage(req, res) {
  try {
    const newPage = req.body;

    // Cek apakah sudah ada page dengan pageCode yang sama
    const existing = await Util.findOne({
      utilName: "page",
      "utilData.pageCode": newPage.pageCode
    });

    if (existing) {
      return res.status(400).json({ message: "PageCode already exists" });
    }

    // Push page baru ke utilData
    const utilities = await Util.findOneAndUpdate(
      { utilName: "page" },
      { $push: { utilData: newPage } },
      { new: true } // return hasil setelah update
    );

    res.json(utilities);
  } catch (error) {
    console.error("Error adding page:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Export the controller methods
module.exports = {
  getAllUtilities,
  getUtilsByName,

  //Page
  pageCreatePage,
  // Add more controller methods as needed
};
