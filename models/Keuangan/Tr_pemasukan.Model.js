const mongoose = require("mongoose");

const Tr_pemasukanSchema = mongoose.Schema(
  {
    Tr_pemasukan_invoice: {
      type: String,
      required: true,
    },
    Tr_pemasukan_nama: {
      type: String,
      required: true,
    },
    Tr_pemasukan_userId: {
      type: String,
      ref: "datapelanggannonpembayaran",
      required: true,
    },
    Tr_pemasukan_kategori: {
      type: String,
      required: true,
    },
    Tr_pemasukan_detail: {
      type: Object,
    },
    Tr_pemasukan_status: {
      type: String,
      enum: ["Y", "N", "B", "C"],
    },
    Tr_pemasukan_created: {
      type: String,
      required: true,
    },
    Tr_pemasukan_updated: {
      type: Array,
    },
    companyName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Tr_pemasukan = mongoose.model("Tr_pemasukan", Tr_pemasukanSchema);

module.exports = Tr_pemasukan;
