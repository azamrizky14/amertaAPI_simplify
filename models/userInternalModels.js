const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const dbListPromise = require("../functions/connectToDatabases");

// Define your schema
const userInternalSchema = new mongoose.Schema({
  // Define your schema fields
  // For example:
  companyCode: {
    type: Array,
    require: true
  },
  companyName: {
    type: String
  },
  userName: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  userBirth: {
    type: String,
    required: [true, "Please enter your birth"],
  },
  userPhone: {
    type: String,
    required: [true, "Please enter your Phone Number"],
  },
  userAddress: {
    type: String,
  },
  userAccess: {
    type: Array,
  },
  accessEdited: {
    type: Boolean,
    default: false, // no dan yes
  },
  userAccStatus: {
    type: String,
    enum: ["enable", "disable"],
    default: "enable" //  active dan inactive
  },
  hierarchyCode: {
    type: String,
    required: [true, "Please enter your hierarchyCode"],
  },
  userGender: {
    type: String,
    enum: ["pria", "wanita", ""],
    default: ""
  },
  userImage: {
    data: Buffer,
    contentType: String,
  },
  imageName: {
    type: String
  },
  userRole: {
    type: String,
    required: [true, "Please enter your Role"],
  },
  isDeleted: {
    type: Boolean,
    default: false // true dan false
  },
  userProperties: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
});

// Hash the password before saving to the database
userInternalSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it's modified or new
    if (!this.isModified("password")) {
      return next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// // Access the desired connection from dbList and create the model
// async function createAndExportUserInternalModel() {
//   try {
//     // Wait for dbList to resolve
//     const dbList = await dbListPromise;
    
//     // Access the desired connection from dbList
//     const testERP_core_connection = dbList["testERP_core"];

//     // If the connection is available, create and export the model
//     if (testERP_core_connection) {
//       const UserInternal = testERP_core_connection.model("userInternal", userInternalSchema, "userInternal");
//       return UserInternal;
//     } else {
//       throw new Error("testERP_core database connection not found");
//     }
//   } catch (error) {
//     console.error("Error creating userInternal model:", error);
//     throw error;
//   }
// }

// Export the function to create and get the userInternal model
// module.exports = createAndExportUserInternalModel;

const userInternal = mongoose.model("userInternal", userInternalSchema);

module.exports = userInternal;