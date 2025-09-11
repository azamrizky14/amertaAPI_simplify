const mongoose = require("mongoose");

const GradingSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "userInternal",
    required: true,
  },
  Grade: {
    Safety: { type: String, required: true },
    Wisdom: { type: String, required: true },
    Precision: { type: String, required: true },
    Service: { type: String, required: true },
    Description: { type: String, required: true },
  },
  Created: {
    CreatedBy: { type: String, default: "System" },
    CreatedAt: { type: Date, default: Date.now },
    CreatedAction: { type: String, default: "Initial Create Grade" },
  },
  Status: { type: String, required: true },
  Updated: [
    {
      _id: false,
      UpdatedBy: { type: String, required: true },
      UpdatedAt: { type: Date, default: Date.now, required: true },
      UpdatedAction: { type: String, required: true },
    },
  ],
  CompanyName: { type: String, required: true },
});

const Grading = mongoose.model("Grading", GradingSchema);

module.exports = Grading;
