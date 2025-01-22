const mongoose = require("mongoose");

const Tr_pembayaranSchema = mongoose.Schema({
    Tr_pembayaran_domain: {
        type: String,
        required: [true, "domain tolong jangan dikosongi"],
    },
    Tr_pembayaran_pengguna_nama: {
        type: String,
        required: [true, "Nama pelanggan tolong jangan dikosongi"],
    },
    Tr_pembayaran_pengguna_id: {
        type: String,
        required: [true, "Id pelanggan tolong jangan dikosongi"]
    },
    Tr_pembayaran_status: {
        type: String,
        required: [true, "status tolong jangan dikosongi"],
    },
    Tr_pembayaran_status_bayar: {
        type: String,
        required: [true, "status pembayaran tolong jangan dikosongi"]
    },
    Tr_pembayaran_tanggal: {
        type: String,
        required: [true, "jumlah tolong jangan dikosongi"],
    },
    Tr_pembayaran_paket: {
        type: Object
    },
    Tr_pembayaran_biaya: {
        type: Object
    },
    Tr_pembayaran_metode_bayar: {
        type: String,
        required: [true, "Metode bayar tolong jangan dikosongi"],
    },
    Tr_pembayaran_keterangan: {
        type: String,
        required: [true, "Keterangan tolong jangan dikosongi"],
    },
    Tr_pembayaran_created: {
        type: String,
        required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_pembayaran_user_updated: {
        type: String,
        required: [true, "User update tolong jangan dikosongi"],
    },
    Tr_pembayaran_no_transaksi: {
        type: String,
        required: [true, "No transaksi tolong jangan dikosongi"],

    }

}, {
    timestamps: true,
});


const Tr_pembayaran = mongoose.model("Tr_pembayaran", Tr_pembayaranSchema);

module.exports = Tr_pembayaran;