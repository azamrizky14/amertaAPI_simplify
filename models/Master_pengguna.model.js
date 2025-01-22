const mongoose = require("mongoose");

const Master_penggunaSchema = mongoose.Schema({
    master_pengguna_nama: {
        type: String,
        required: [true, "NAMA pengguna TOLONG JANGAN DIKOSONGI"],
    },
    master_pengguna_id: {
        type: String,
        required: [true, "ID PELANGGAN JANGAN DIKOSONGI"]
    },
    master_pengguna_domain: {
        type: String,
        required: [true, "domain tolong jangan dikosongi"]
    },
    master_pengguna_status: {
        type: String,
        required: [true, "STATUS pengguna TOLONG JANGAN DIKOSONGI"],
    },
    master_pengguna_alamat: {
        type: String,
        required: [true, "ALAMAT pengguna TOLONG JANGAN DIKOSONGI"]
    },
    master_pengguna_role: {
        type: String,
        required: [true, "Role tolong jangan dikosongi"]
    },
    master_pengguna_no_telepon: {
        type: String,
        required: [true, "NO TELEPON tolong jangan dikosongi "]
    },
    master_pengguna_ppoe: {
        type: String,
        required: [true, "PPOE tolong jangan dikosongi"]
    },
    master_pengguna_detail_identitas: {
        type: Object
    },
    master_pengguna_tanggal_pemasangan: {
        type: String,
        required: [true, "tanggal pemasangan jangan dikosongi"]
    },
    master_pengguna_created: {
        type: String,
        required: [true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_pengguna_updated: {
        type: String,
        required: [true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_pengguna_user_updated: {
        type: String,
        required: [true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_pengguna_auth: {
        type: Object
    },
    master_pengguna_penagihan_paket: {
        type: Object
    },
    master_pengguna_tipe_pelanggan: {
        type: String,
        required: [true, "TOLONG DIISI TIPE PELANGGANNYA"]
    },
    master_pengguna_pic_psb: {
        type: Array,
        default: "[]"
    },
    master_pengguna_router: {
        type: Object
    }
}, {
    timestamps: true,
});

 
const Master_pengguna = mongoose.model("Master_pengguna", Master_penggunaSchema);

module.exports = Master_pengguna;