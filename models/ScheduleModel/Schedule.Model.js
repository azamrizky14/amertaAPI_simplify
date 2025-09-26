const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  ScheduleId: {
    type: String,
    required: true,
    unique: true,
  },
  ScheduleName: {
    type: String,
    required: true,
    ref: "Area",
  },
  ScheduleArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
  ScheduleType: {
    type: String,
    required: true,
  },
  ScheduleMember: [
    {
      _id: false,
      ScheduleMemberId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "userInternal" },
    },
  ],
  ValidFrom: {
    type: String,
    required: true,
  },
  ValidTo: {
    type: String,
    required: true,
  },
  Created: {
    CreatedBy: { type: String, default: "System" },
    CreatedAt: { type: String },
  },
  status: { type: String, required: true },
  Updated: [
    {
      UpdatedBy: { type: String, default: "System" },
      UpdatedAt: { type: String },
    },
  ],
  CompanyName: { type: String, required: true },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
