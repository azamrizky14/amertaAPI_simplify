const mongoose = require("mongoose");

const TrCrmSchema = mongoose.Schema(
  {
    Tr_crm_id: {
      type: String,
      required: true,
    },
    Tr_crm_nama: {
      type: String,
      required: true,
    },
    Tr_crm_kategori: {
      type: String,
      required: true,
    },
    Tr_crm_detail: {
      type: Object,
    },
    Tr_crm_lokasi: {
      type: String,
    },
    Tr_crm_timezone: {
      type: String,
    },
    Tr_crm_status: {
      type: String,
      enum: ["Y", "N", "B", "C"],
    },
    Tr_crm_created: {
      type: String,
      required: true,
    },
    Tr_crm_updated: {
      type: Array,
    },
    companyName: {
      type: String,
    },
    companyCode: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const TrCrm = mongoose.model("TrCrm", TrCrmSchema);

module.exports = TrCrm;
