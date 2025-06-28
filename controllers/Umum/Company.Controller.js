// companyController.js
require('dotenv').config();

const Company = require("../../models/Umum/Company.Models");
const UserInternal = require("../../models/Umum/UserInternal.Models");


// Controller method to create a new user
async function listBycompanyCode(req, res) {
  try {
    const companyCode = req.body.companyCode;
    const hierarchyCode = req.body.hierarchyCode; // Assuming hierarchyCode is passed in the request body

    if (!companyCode || !Array.isArray(companyCode) || companyCode.length === 0) {
      return res.status(400).json({ message: "Invalid companyCode provided" });
    }

    // Initialize query with isDeleted condition
    let query = { isDeleted: "N" };

    // Check hierarchyCode and adjust the query accordingly
    if (hierarchyCode && parseFloat(hierarchyCode) > 1.1) {
      // If hierarchyCode is greater than 1.1, find data with exact same companyCode
      query.companyCode = { $eq: companyCode };
    } else {
      // If hierarchyCode is 1.1 or less, use the original logic
      query.companyCode = { $elemMatch: { $in: companyCode } };
    }

    // Retrieve all companies that match the criteria
    const companies = await Company.find(query);
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Controller method to get all users
async function getAllDomain(req, res) {
  try {
    // Retrieve all users from the database
    const users = await Company.find({ isDeleted: "N" });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// Controller method to get company by ID with selective fields
async function getCompanyByCode(req, res) {
  try {
    const companyCode = JSON.parse(req.params.code); // Extract the ID from the parameters

    // Retrieve all users from the database
    const company = await Company.findOne ({ companyCode: companyCode });
    res.json(company);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to get company by ID with selective fields
async function getCompanyById(req, res) {
  try {
    const _id = req.params._id; // Extract the ID from the parameters
    const fields = req.params.fields; // Extract the requested fields from the parameters

    // Find the company by ID
    const company = await Company.findById(_id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    } else if (company.isDeleted === "yes") {
      return res.status(404).json({ message: "Company has been deleted" });
    }

    // Find the userInternal by createdBy ID
    const userInternal = await UserInternal.findById(company.createdBy);

    if (!userInternal) {
      return res.status(404).json({ message: "UserInternal not found" });
    }

    // Format the response to include specific fields from userInternal
    const formattedUserInternal = {
      _id: userInternal._id,
      name: userInternal.userName,
      email: userInternal.email,
      // Include any other fields you need from the userInternal object
    };

    // If fields are provided, filter the company data
    let responseData;
    if (fields) {
      const fieldArray = fields.split('-');
      responseData = fieldArray.reduce((acc, field) => {
        if (company[field] !== undefined) {
          acc[field] = company[field];
        }
        return acc;
      }, {});
    } else {
      responseData = company.toObject(); // Convert Mongoose document to plain JavaScript object
    }

    // Include the formatted userInternal data in the response
    responseData.createdBy = userInternal.userName;

    res.json(responseData); // Send the filtered company data in the response
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to create a new company

const createCompany = async (req, res) => {
  try {
    let data = req.body;

    // Check if a file is uploaded
    if (req.file) {
      data.companyLogo = {
        data: req.file.buffer, // Store file content as Buffer
        contentType: req.file.mimetype, // Store file MIME type
      };
      data.logoName = req.file.originalname; // Store file name
    }

    data.companyPage = JSON.parse(data.companyPage)

    // Transform the companyCode as per the requirement
    let newNumber = 1;
    const originalcompanyCode = JSON.parse(data.companyCode);
    const lastcompanyCode = originalcompanyCode[originalcompanyCode.length - 1];
    let newcompanyCode = [...originalcompanyCode, [...lastcompanyCode, newNumber]];

    // Function to check if the company code already exists
    const iscompanyCodeExists = async (code) => {
      const existingCompany = await Company.findOne({ companyCode: code });
      return !!existingCompany;
    };

    // Check if the company code already exists, incrementing newNumber if necessary
    while (await iscompanyCodeExists(newcompanyCode)) {
      newNumber++;
      newcompanyCode = [...originalcompanyCode, [...lastcompanyCode, newNumber]];
    }

    // Update the data with the new unique companyCode
    data.companyCode = newcompanyCode;

    // Create a new company based on the modified data
    const newCompany = await Company.create(data);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller method to update a company
const updateCompany = async (req, res) => {
  try {
      const companyId = req.params._id;
      let data = req.body;

      // Check if a file is uploaded
      if (req.file) {
          data.companyLogo = {
              data: req.file.buffer, // Store file content as Buffer
              contentType: req.file.mimetype, // Store file MIME type
          };
          data.logoName = req.file.originalname; // Store file name
      } else {
          // If no file is uploaded, delete the companyLogo property from data to avoid updating it
          delete data.companyLogo;
      }

      data.companyPage = JSON.parse(data.companyPage);

      // Parse and update companyCode as necessary
      data.companyCode = JSON.parse(data.companyCode);

      // Find and update the company with new data, incrementing the __v field
      const updatedCompany = await Company.findByIdAndUpdate(
          companyId,
          {
              ...data,
              $inc: { __v: 1 }
          },
          { new: true }
      );

      if (!updatedCompany) {
          return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json(updatedCompany);
  } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


// Export the controller methods
module.exports = {
  listBycompanyCode,
  getAllDomain,
  createCompany,
  updateCompany,
  getCompanyById,
  getCompanyByCode
  // Add more controller methods as needed
};
