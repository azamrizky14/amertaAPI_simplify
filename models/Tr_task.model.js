const mongoose = require("mongoose");

const Tr_taskSchema = mongoose.Schema({
    Tr_task_kode: {
        type: String,
        required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_task_status: {
        type: String,
        required: [true, "User tolong jangan dikosongi"]
    },
    Tr_task_domain: {
        type: String,
        required: [true, "Domain tolong jangan dikosongi"],
    },
    Tr_task_nama:{
        type: String,
        required: [true, "Nama Pelanggan tolong jangan dikosongi"],
    },
    Tr_task_no_telepon:{
        type: String,
        required: [true, "No Telepon Pelanggan tolong jangan dikosongi"],
    },
    Tr_task_alamat:{
        type: String,
        required: [true, "Alamat Pelanggan tolong jangan dikosongi"],
    },
    Tr_task_priority: {
        type: String,
        required: [true, "Domain tolong jangan dikosongi"],
    },
    Tr_task_kategori: {
        type: String,
        required: [true, "Domain tolong jangan dikosongi"],
    },
    Tr_task_created: {
        type: String,
        required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_task_detail: {
        type: String,
        required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_task_pic: {
        type: String,
        required: [true, "PIC tolong jangan dikosongi"],
    },
    Tr_task_pegawai_list_penangan: {
        type: String,
        default: "[]",
    },
}, {
    timestamps: true,
});


const Tr_task = mongoose.model("Tr_task", Tr_taskSchema);

module.exports = Tr_task;