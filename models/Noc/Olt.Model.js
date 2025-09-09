const mongoose = require("mongoose");

const OLTSchema = new mongoose.Schema({
  oltId: { type: String, required: true },
  oltHost: { type: String, required: true },
  oltPort: { type: Number, required: true },
  oltUsername: { type: String, required: true },
  oltPassword: { type: String, required: true },
  created: { type: Date, default: Date.now() },
  companyName: { type: String, required: true },
});

module.exports = mongoose.model("OLT", OLTSchema);
