const mongoose = require("mongoose");

const Master_pengadaanbarangSchema = mongoose.Schema(
    {
        master_pengadaan_barang_nama: {
            type: String,
            required: [true, "master_pengadaan_barang_nama tolong jangan dikosongi"],
        },
        master_pengadaan_barang_pic: {
            type: String,
            required: [true, "master_pengadaan_barang_nama tolong jangan dikosongi"],
        },
        master_pengadaan_barang_kategori: {
            type: String,
            required: [true, "master_pengadaan_barang_nama tolong jangan dikosongi"],
        },
        master_pengadaan_barang_domain: {
            type: String,
            required: [true, "master_pengadaan_barang_domain TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_created: {
            type: String,
            required: [true, "master_pengadaan_barang_created TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_updated: {
            type: String,
            required: [true, "master_pengadaan_barang_updated TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_user_updated: {
            type: String,
            required: [true, "master_pengadaan_barang_user_updated TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_status: {
            type: String,
            required: [true, "master_pengadaan_barang_status  TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_harga: {
            type: String,
            required: [true, "master_pengadaan_barang_status  TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_realisasi_kebutuhan: {
            type: String,
            required: [true, "master_pengadaan_barang_status  TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_realisasi_sudah: {
            type: String,
            required: [true, "master_pengadaan_barang_status  TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_no_kuitansi: {
            type: String,
            required: [true, "master_pengadaan_barang_status  TOLONG JANGAN DIKOSONGI"]
        },
        master_pengadaan_barang_realisasi_list: {
            type: Array,
            "default": []
        }
    },
    {
        timestamps: true,
    }
);


const Master_pengadaan_barang = mongoose.model("Master_pengadaan_barang", Master_pengadaanbarangSchema);

module.exports = Master_pengadaan_barang;