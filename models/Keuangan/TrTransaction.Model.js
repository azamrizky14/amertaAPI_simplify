const mongoose = require("mongoose");

const TrTransactionSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  merchant_ref: { type: String },
  amount: { type: String },
  vendor_methods: { type: String },
  method: { type: String },
  customerId: { type: String },
  payment_period: { type: String },
  domain: { type: String },
  status: { type: String },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("TrTransaction", TrTransactionSchema, "trtransactions");
