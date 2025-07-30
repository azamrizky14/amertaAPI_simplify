const mongoose = require("mongoose");

const DataCoaSchema = mongoose.Schema(
  {
    Data_coa_struktur_akun_code: {
      type: String,
      required: true,
    },
    Data_coa_struktur_akun_nama: {
      type: String,
      required: true,
    },
    Data_coa_struktur_akun_tipe: {
      type: String,
      required: true,
    },
    Data_coa_struktur_akun_list: {
      type: Array,
    },
    Data_coa_status: {
      type: String,
      enum: ["Y", "N", "B", "C"],
    },
    Data_coa_created: {
      type: String,
      required: true,
    },
    Data_coa_updated: {
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

const DataCoa = mongoose.model("DataCoa", DataCoaSchema);

module.exports = DataCoa;
