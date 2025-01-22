const mongoose = require("mongoose");

const Tr_reinputSchema = mongoose.Schema({
    Tr_reinput_pic: {
        type: String,
        required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_reinput_supplier: {
        type: String,
        required: [true, "supplier tolong jangan dikosongi"],
    },
    Tr_reinput_status: {
        type: String,
        required: [true, "User tolong jangan dikosongi"]
    },
    Tr_reinput_nama_barang: {
        type: String,
        required: [true, "barang tolong jangan dikosongi"],
    },
    Tr_reinput_jumlah: {
        type: String,
        required: [true, "jumlah tolong jangan dikosongi"],
    },
    Tr_reinput_tahap: {
        type: Array,
        "default": []
    },
    Tr_reinput_before: {
        type: String
    },
    Tr_reinput_after: {
        type: String
    },
    Tr_reinput_keterangan: {
        type: String,
        required: [true, "Keterangan tolong jangan dikosongi"],
    },
    Tr_reinput_tindak_lanjut: {
        type: String,
        required: [true, "Tindak Lanjut tolong jangan dikosongi"],
    },
    Tr_reinput_domain: {
        type: String,
        required: [true, "Domain tolong jangan dikosongi"],
    },
    Tr_reinput_created: {
        type: String,
        required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_reinput_user_updated: {
        type: String,
        required: [true, "User tolong jangan dikosongi"],
    },
    Tr_reinput_no_transaksi: {
        type: String,
        required: [true, "User tolong jangan dikosongi"]
    }

}, {
    timestamps: true,
});


const Tr_reinput = mongoose.model("Tr_reinput", Tr_reinputSchema);

module.exports = Tr_reinput;