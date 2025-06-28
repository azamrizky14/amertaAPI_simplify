const mongoose = require("mongoose");

const DataDrafterSchema = mongoose.Schema(
  {
    data_drafter_nama: {
      type: String,
      required: true,
    },
    data_drafter_type: {
      type: String,
      required: true,
    },
    data_drafter_titik_koordinat: {
      type: String,
      required: true,
    },
    data_drafter_status: {
      type: String,
      required: true,
    },
    data_drafter_image: {
      type: String,
      required: true,
    },
    data_drafter_created: {
      type: String,
      required: true,
    },
    data_drafter_updated: {
      type: Array,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyCode: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DataDrafter = mongoose.model("DataDrafter", DataDrafterSchema);

module.exports = DataDrafter;
