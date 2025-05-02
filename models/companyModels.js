const mongoose = require("mongoose");

// Define your schema
const companySchema = new mongoose.Schema({
  // Define your schema fields
  // For example:
  companyCode: {
    type: Array,
    required: [true, "Please enter company Code"],
  },
  companyName: {
    type: String,
    required: [true, "Please enter company Name"],
  },
  companyDesc: {
    type: String,
  },
  companyLocation: {
    type: String
  },
  companyType: {
    type: String
  },
  companyLogo: {
    data: Buffer,
    contentType: String
  },
  logoName: {
    type: String
  },
  companyPage: {
    type: Array || String,
  },
  companyCreated: {
    type: String
  },
  createdBy: {
    type: String,
    require: [true, "Please enter the creator"]
  },
  isDeleted: {
    type: String  }
}, {
  timestamps: true,
});

const Company = mongoose.model("master_company", companySchema);

module.exports = Company;
