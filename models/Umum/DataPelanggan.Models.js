const mongoose = require("mongoose");

const DataPelangganSchema = mongoose.Schema(
  {
    data_pelanggan_nama: {
      type: String,
      required: true,
    },
    data_pelanggan_id: {
      type: String,
      required: true,
    },
    data_pelanggan_lokasi: {
      type: String,
      required: true,
    },
    data_pelanggan_phone: {
      type: String,
      required: true,
    },
    data_pelanggan_status: {
      type: String,
      enum: ["Y", "N", "B", "C"],
    },
    data_pelanggan_nik: {
      type: String,
      required: true,
    },
    data_pelanggan_domisili: {
      type: Object,
      default: {},
    },
    data_pelanggan_drafter: {
      type: Object,
      default: {},
    },
    data_pelanggan_history: {
      type: Object,
      default: {},
    },
    data_pelanggan_paket: {
      type: Object,
      default: {},
    },
    data_pelanggan_tanggal: {
      type: Object,
      default: {},
    },
    data_pelanggan_alamat: {
      type: Object,
      default: {},
    },
    data_pelanggan_pic: {
      type: Object,
      default: {},
    },
    data_pelanggan_mikrotik_access: {
      type: Object,
      default: {},
    },
    data_pelanggan_afiliasi: {
      type: Object,
      default: {},
    },
    data_pelanggan_created: {
      type: String,
      required: true,
    },
    data_pelanggan_updated: {
      type: Array,
    },
    data_pelanggan_images: {
      type: Object,
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

const DataPelanggan = mongoose.model("DataPelanggan", DataPelangganSchema);

module.exports = DataPelanggan;
