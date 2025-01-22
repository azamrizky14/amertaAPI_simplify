const mongoose = require("mongoose");

const Tr_qcSchema = mongoose.Schema(
  {
    Tr_qc_pic: {
      type: String,
      required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_qc_supplier: {
      type: String,
      required: [true, "supplier tolong jangan dikosongi"],
    },
    Tr_qc_status: {
      type: String,
      required: [true, "User tolong jangan dikosongi"]
    },
    Tr_qc_nama_barang: {
      type: String,
      required: [true, "barang tolong jangan dikosongi"],
    },
    Tr_qc_jumlah: {
      type: String,
      required: [true, "jumlah tolong jangan dikosongi"],
    },
    Tr_qc_tahap: {
      type: Array,
      "default": []
    },
    Tr_qc_before: {
      type: String
    },
    Tr_qc_after: {
      type: String
    },
    Tr_qc_keterangan: {
      type: String,
      required: [true, "Keterangan tolong jangan dikosongi"],
    },
    Tr_qc_tindak_lanjut: {
      type: String,
      required: [true, "Tindak Lanjut tolong jangan dikosongi"],
    },
    Tr_qc_domain: {
      type: String,
      required: [true, "Domain tolong jangan dikosongi"],
    },
    Tr_qc_created: {
      type: String,
      required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_qc_user_updated: {
      type: String,
      required: [true, "User tolong jangan dikosongi"],
    },
    Tr_qc_no_transaksi: {
      type: String,
      required: [true, "User tolong jangan dikosongi"]
    }

  },
  {
    timestamps: true,
  }
);


const Tr_qc = mongoose.model("Tr_qc", Tr_qcSchema);

module.exports = Tr_qc;