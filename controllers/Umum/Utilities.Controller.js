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
    const existing = await Utilities.findOne({
      utilName: "page",
      "utilData.pageCode": newPage.pageCode
    });

    if (existing) {
      return res.status(400).json({ message: "PageCode already exists" });
    }

    // Push page baru ke utilData
    const utilities = await Utilities.findOneAndUpdate(
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

async function pageGetByCode(req, res) {
  try {
    const { code } = req.params;

    const util = await Utilities.findOne({ utilName: "page" });
    if (!util) {
      return res.status(404).json({ message: "No page util found" });
    }

    const page = util.utilData.find(p => p.pageCode === code);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to update a page, with pageCode uniqueness check
async function pageUpdateByCode(req, res) {
  try {
    const { code } = req.params;   // pageCode lama
    const updateData = req.body;   // data baru

    // Jika pageCode baru dikirim dan berbeda dengan yang lama
    if (updateData.pageCode && updateData.pageCode !== code) {
      const duplicate = await Utilities.findOne({
        utilName: "page",
        "utilData.pageCode": updateData.pageCode
      });

      if (duplicate) {
        return res.status(400).json({
          message: `PageCode "${updateData.pageCode}" already exists`
        });
      }
    }

    // Update elemen array utilData
    const utilities = await Utilities.findOneAndUpdate(
      { utilName: "page", "utilData.pageCode": code },
      { $set: { "utilData.$": updateData } },
      { new: true }
    );

    if (!utilities) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Ambil page hasil update (pakai pageCode baru jika ada)
    const updatedPage = utilities.utilData.find(
      p => p.pageCode === (updateData.pageCode || code)
    );

    res.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Export the controller methods
module.exports = {
  getAllUtilities,
  getUtilsByName,

  //Page
  pageCreatePage,
  pageGetByCode,
  pageUpdateByCode,
  // Add more controller methods as needed
};
