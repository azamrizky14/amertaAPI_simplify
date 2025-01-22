const mongoose = require("mongoose");

const Tr_logistic_keluarkeluarSchema = mongoose.Schema(
  {
    Tr_logistic_keluar_nama_item: {
      type: String,
      required: [true, "Nama Item transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_keperluan_nama_pelanggan: {
      type: String,
      required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_logistic_keluar_tanggal: {
      type: String,
      required: [true, "Tanggal tolong jangan dikosongi"],
    },
    Tr_logistic_keluar_domain: {
      type: String,
      required: [true, "Tanggal tolong jangan dikosongi"],
    },
    Tr_logistic_keluar_total: {
      type: String,
      required: [true, "Jenis transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_kode_transaksi: {
      type: String,
      required: [true, "Kode transaksi tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_created: {
      type: String,
      required: [true, "Tanggal pembuatan tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_user_created: {
      type: String,
      required: [true, "User created tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_alamat: {
      type: String,
      required: [true, "Nomor resi tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_status: {
      type: String,
      required: [true, "Status tolong jangan dikosongi"]
    },
    // Digunakan untuk kategori PSB,Jalur,Maintenance 
    Tr_logistic_keluar_kategori: {
      type: String,
      required: [true, "Kategori tolong jangan dikosongi"]
    },
    Tr_logistic_keluar_detail: {
      type: Object,
      required: true
    },
    Tr_logistic_keluar_pegawai_list: {
      type: Array,
      "default": []
    },
    Tr_logistic_keluar_gambar: {
      type: String
    },
    Tr_logistic_keluar_type: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);


const Tr_logistic_keluar = mongoose.model("Tr_logistic_keluar", Tr_logistic_keluarkeluarSchema);

module.exports = Tr_logistic_keluar;