// companyController.js
require('dotenv').config();

// const createRoleModel = require("../models/roleModels");
// const createUserInternalModel = require("../models/userInternalModels");

// let Role 
// async function getRole() {
//     Role = await createRoleModel();
// }  
// getRole()

// let UserInternal 
// async function getUserInternal() {
//     UserInternal = await createUserInternalModel();
// }  
// getUserInternal()

const Role = require("../models/roleModels");
const UserInternal = require("../models/userInternalModels");

async function getSortedRole(req, res) {
  try {
    const { sortOrder } = req.params;

    // Build the query object
    const query = { isDeleted: false };

    // Determine sort direction: 1 for ascending, -1 for descending
    const sortDirection = sortOrder === 'up' ? 1 : -1;

    // Retrieve and sort roles based on hierarchyCode
    const roles = await Role.find(query).sort({ hierarchyCode: sortDirection });

    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
   

// Controller method to get all users
async function getAllRole(req, res) {
  try {
    // Retrieve all users from the database
    const role = await Role.find({ isDeleted: false });
    res.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Controller method to get all roles
async function getAllRoleInternal(req, res) {
  try {
    // Extract hierarchyCode from request parameters
    const { hierarchyCode } = req.params;

    // Build the query object
    let query = { isDeleted: false };

    // Add condition to check hierarchyCode
    if (hierarchyCode && hierarchyCode < '1.0') {
      query.hierarchyCode = { $gte: hierarchyCode, $lt: "2.0" };
    } else if (hierarchyCode) {
      query.hierarchyCode = { $gt: hierarchyCode, $lt: "2.0" };
    } else {
      query.hierarchyCode = { $lt: "2.0" };
    }

    // Retrieve roles from the database based on the query
    const roles = await Role.find(query);

    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Controller method to get all roles
async function getAllRoleExternal(req, res) {
  try {
    // Extract hierarchyCode from request parameters
    const { hierarchyCode } = req.params;

    // Initialize the query object
    let query = { isDeleted: false };

    // Add condition based on hierarchyCode
    if (hierarchyCode && parseFloat(hierarchyCode) < 1.3) {
      query.hierarchyCode = { $gte: "2.0" };
    } else {
      res.json([]); // Return empty array if hierarchyCode is not provided or >= 1.3
      return;
    }

    // Retrieve roles from the database based on the query
    const roles = await Role.find(query);

    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Export the controller methods
module.exports = {
  getAllRole,
  getSortedRole,
  getAllRoleInternal,
  getAllRoleExternal
  // Add more controller methods as needed
};
