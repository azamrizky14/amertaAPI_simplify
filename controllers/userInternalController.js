// userInternalController.js
require('dotenv').config();
// const createUserInternalModel = require("../models/userInternalModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// let UserInternal
// async function getUserInternal() {
//   UserInternal = await createUserInternalModel();
// }

// getUserInternal()

const UserInternal = require("../models/userInternalModels");

// Controller method to get all users
async function getAllUsers(req, res) {
  try {
    // Retrieve all users from the database
    const users = await UserInternal.find({ isDeleted: false });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to get all users
async function getUserByRole(req, res) {
  try {
    const { companyName, userRole } = req.params;
    
    const filter = { isDeleted: false, companyName: companyName };

    // Add optional filters if provided
    if (userRole) filter.userRole = userRole;

    // Retrieve all users from the database
    const users = await UserInternal.find(filter);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to get user data by ID
async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await UserInternal.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    else if (user.isDeleted === "yes") {
      return res.status(404).json({ message: "User has deleted" });
    }
    else if (user.userAccStatus === "disabled") {
      return res.status(404).json({ message: "User has blocked" });
    }

    res.json(user); // Send the user data in the response
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to create a new user
async function createUserOne(req, res) {
  try {
    const email = req.body.email
    const user = await UserInternal.findOne({ email });

    // Check if user exists
    if (user) {
      return res.status(401).json({ message: "Email Sudah Digunakan!" });
    }
    // Create a new user based on the request body
    const newUser = await UserInternal.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to update user data
async function updateUserOne(req, res) {
  try {
    const { userId } = req.params; // Assuming userId is passed in the request URL
    const { oldPassword, newPassword, ...newData } = req.body; // Extract oldPassword and newPassword from the request body

    const dataUser = await UserInternal.findById(userId);
    if (!dataUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (dataUser.isDeleted === "yes") {
      return res.status(404).json({ message: "User has been deleted" });
    }
    if (dataUser.userAccStatus === "disabled") {
      return res.status(404).json({ message: "User has been blocked" });
    }

    // If oldPassword and newPassword are provided, handle password update
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, dataUser.password); // Assuming the password is stored in a field named 'password'
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      newData.password = hashedPassword;
    }

    // Find the user by ID and update their data
    const updatedUser = await UserInternal.findByIdAndUpdate(userId, newData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Increment the __v field by 1
    updatedUser.__v += 1;
    await updatedUser.save();

    res.json(updatedUser); // Send the updated user data in the response
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createUser(req, res) {
  try {
    const email = req.body.email
    const user = await UserInternal.findOne({ email });

    // Check if user exists
    if (user) {
      return res.status(401).json({ message: "Email Sudah Digunakan!" });
    }

    let data = req.body;

    // Check if a file is uploaded
    if (req.file) {
      data.userImage = {
        data: req.file.buffer, // Store file content as Buffer
        contentType: req.file.mimetype, // Store file MIME type
      };
      data.imageName = req.file.originalname; // Store file name
    }
    data.userAccess = JSON.parse(data.userAccess);
    data.companyCode = JSON.parse(data.companyCode);
    // Create a new company based on the modified data
    const newCompany = await UserInternal.create(data);
    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller method to update a company
async function updateUser(req, res) {
  try {
    const userId = req.params._id;
    let data = req.body;

    // Check if a file is uploaded
    if (req.file) {
      data.userImage = {
        data: req.file.buffer, // Store file content as Buffer
        contentType: req.file.mimetype, // Store file MIME type
      };
      data.imageName = req.file.originalname; // Store file name
    } else {
      // If no file is uploaded, delete the userImage property from data to avoid updating it
      delete data.userImage;
    }

    data.userAccess = JSON.parse(data.userAccess);

    // Parse and update companyCode as necessary
    const originalCompanyCode = JSON.parse(data.companyCode);


    data.companyCode = originalCompanyCode;

    // Find and update the company with new data, incrementing the __v field
    const updateUserInternal = await UserInternal.findByIdAndUpdate(
      userId,
      {
        ...data,
        $inc: { __v: 1 }
      },
      { new: true }
    );

    if (!updateUserInternal) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updateUserInternal);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserInternal.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Email belum terdaftar!" });
    }

    // // Generate a bcrypt hash
    // bcrypt.hash(password, 10, (err, hash) => {
    //   if (err) {
    //     console.error('Error hashing password:', err);
    //   } else {
    //     console.log('Generated bcrypt hash:', hash);
    //   }
    // });

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password Salah!" });
    }

    // Create a lightweight payload excluding userImage and other large fields
    const payload = {
      _id: user._id,
      email: user.email,
      userName: user.userName,
      userRole: user.userRole,
      companyCode: user.companyCode,
      companyName: user.companyName,
      companyPage: user.companyPage,
      userAccStatus: user.userAccStatus,
      hierarchyCode: user.hierarchyCode,
      userAccess: user.userAccess
    };

    // Generate a JWT token with the lightweight payload
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the token and user data (without userImage) in the response
    res.json({ token, user: payload });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// Controller method to list companies by companyCode
async function listByCompanyCode(req, res) {
  try {
    const companyCode = req.body.companyCode;

    if (!companyCode || !Array.isArray(companyCode) || companyCode.length === 0) {
      return res.status(400).json({ message: "Invalid companyCode provided" });
    }

    // Initialize query with isDeleted condition
    let query = { isDeleted: false };

    // Check if companyCode equals [[0]]
    if (JSON.stringify(companyCode) !== JSON.stringify([[0]])) {
      // For other companyCode values, filter by the provided companyCode
      query.companyCode = { $eq: companyCode };
    }

    // Retrieve all companies that match the criteria, as plain JavaScript objects
    const userInternal = await UserInternal.find(query).lean();
    // console.log('ini user internal', userInternal);

    // Remove 'userImage' property from each object in the result array
    const finalUser = userInternal.map(({ userImage, ...rest }) => rest);

    res.json(finalUser);
  } catch (error) {
    console.error("Error fetching userInternal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}




// Export the controller methods
module.exports = {
  createUser,
  getAllUsers,
  createUserOne,
  loginUser,
  updateUser,
  updateUserOne,
  getUserById,
  getUserByRole,

  listByCompanyCode
  // Add more controller methods as needed
};
