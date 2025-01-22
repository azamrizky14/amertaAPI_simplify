// companyController.js
require('dotenv').config();

// const createUtilitiesModel = require("../models/utilitiesModels");

// let Utilities 
// async function getUtilities() {
//     Utilities = await createUtilitiesModel();
// }  
// getUtilities()

const Utilities = require("../models/utilitiesModels");

// Controller method to get all users
async function getAllUtilities(req, res) {
  try {
    // Retrieve all users from the database
    const utilities = await Utilities.find({ isDeleted: false });
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
    const utilities = await Utilities.findOne({ isDeleted: false, utilName: reqUtilName });
    res.json(utilities);
  } catch (error) {
    console.error("Error fetching utilities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Export the controller methods
module.exports = {
  getAllUtilities,
  getUtilsByName
  // Add more controller methods as needed
};
