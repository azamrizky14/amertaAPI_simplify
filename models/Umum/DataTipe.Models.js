const mongoose = require("mongoose");

const DataTipeSchema = mongoose.Schema(
  {
    data_tipe_nama: {
      type: String,
      required: true,
    },
    data_tipe_keterangan: {
      type: String,
      required: true,
    },
    data_tipe_harga: {
      type: String,
      required: true,
    },
    data_tipe_pembayaran: {
      type: String,
      required: true,
    },
    data_tipe_status: {
      type: String,
      enum: ["Y", "N", "B", "C"],
    },
    data_tipe_profile: {
      type: String,
      required: true,
    },
    data_tipe_created: {
      type: String,
      required: true,
    },
    data_tipe_updated: {
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

const DataTipe = mongoose.model("DataTipe", DataTipeSchema);

module.exports = DataTipe;
