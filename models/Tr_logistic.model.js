const mongoose = require("mongoose");

const Tr_logisticSchema = mongoose.Schema(
  {
    Tr_logistic_pic: {
      type: String,
      required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_logistic_tanggal: {
      type: String,
      required: [true, "Tanggal tolong jangan dikosongi"],
    },
    Tr_logistic_domain: {
      type: String,
      required: [true, "Tanggal tolong jangan dikosongi"],
    },
    Tr_logistic_jenis_transaksi: {
      type: String,
      required: [true, "Jenis transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_total: {
      type: String,
      required: [true, "Jenis transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_supplier: {
      type: String,
      required: [true, "Supplier tolong jangan dikosongi"],
    },
    Tr_lokasi_masuk: {
      type: String,
      required: [true, "Lokasi masuk tolong jangan dikosongi"]
    },
    Tr_kode_transaksi: {
      type: String,
      required: [true, "Kode transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_created: {
      type: String,
      required: [true, "Tanggal pembuatan tolong jangan dikosongi"]
    },
    Tr_logistic_user_created: {
      type: String,
      required: [true, "User created tolong jangan dikosongi"]
    },
    Tr_logistic_status_tiba: {
      type: String,
      required: [true, "Status tiba tolong jangan dikosongi"]
    },
    Tr_logistic_no_resi: {
      type: String,
      required: [true, "Nomor resi tolong jangan dikosongi"]
    },
    Tr_logistic_status: {
      type: String,
      required: [true, "Status tolong jangan dikosongi"]
    },
    Tr_logistic_kategori: {
      type: String,
      required: [true, "Kategori tolong jangan dikosongi"]
    },
    Tr_logistic_detail: {
      type: Array,
      "default": []
    },
    Tr_logistic_gambar:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);


const Tr_logistic = mongoose.model("Tr_logistic", Tr_logisticSchema);

module.exports = Tr_logistic;