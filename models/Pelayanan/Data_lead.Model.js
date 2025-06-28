const mongoose = require("mongoose");

const DataLeadSchema = mongoose.Schema(
  {
    Data_lead_nama: {
      type: String,
      required: true,
    },
    Data_lead_from: {
      type: String,
      required: true,
    },
    Data_lead_phone: {
      type: String,
      required: true,
    },
    Data_lead_status_lead: {
      type: String,
      required: true,
    },
    Data_lead_score: {
      type: String,
      required: true,
    },
    Data_lead_kunjungan: {
      type: Array,
      default: [],
    },
    Data_lead_provider: {
      type: Object,
    },
    Data_lead_lokasi: {
      type: String,
    },
    Data_lead_time: {
      type: String,
    },
    Data_lead_status: {
      type: String,
      enum: ["Y", "N"],
    },
    Data_lead_afiliasi: {
      type: String,
      required: true,
    },
    Data_lead_created: {
      type: String,
      required: true,
    },
    Data_lead_updated: {
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

const DataLead = mongoose.model("DataLead", DataLeadSchema);

module.exports = DataLead;
