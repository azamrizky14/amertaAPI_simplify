const mongoose = require("mongoose");

const DataPelangganSchema = mongoose.Schema(
  {
    IdPelanggan: {
      type: Number,
      required: true,
    },
    tanggalRegistrasi: {
      type: String,
      required: true,
    },
    namaPelanggan: {
      type: String,
      required: true,
    },
    Alamat: {
      type: String,
      required: true,
    },
    titikKoordinat: {
      type: String,
      required: true,
    },
    Provinsi: {
      type: String,
      required: true,
    },
    kabupaten: {
      type: String,
      required: true,
    },
    Kecamatan: {
      type: String,
      required: true,
    },
    Kelurahan: {
      type: Object,
      default: {},
    },
    KodePost: {
      type: Number,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    bandwith: {
      type: String,
      required: true,
    },
    Keterangan: {
      type: String,
      required: true,
    },
    Harga: {
      type: Number,
      required: true,
    },
    JatuhTempo: {
      type: Number,
      required: true,
    },
    pembayaran: {
      type: String,
      required: true,
    },
    Catatan: {
      type: String,
      required: true,
    },
    SN: {
      type: String,
      required: true,
    },
    cabang: {
      type: String,
      required: true,
    },
    jenis_koneksi: {
      type: String,
      required: true,
    },
    router: {
      type: String,
      required: true,
    },
    sales: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DataPelanggan = mongoose.model(
  "datapelanggannonpembayaran",
  DataPelangganSchema
);

module.exports = DataPelanggan;
