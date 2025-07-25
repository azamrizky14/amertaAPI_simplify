const mongoose = require("mongoose");

const Tr_teknisSchema = mongoose.Schema({
    Tr_teknis_tanggal: {
        type: String,
    },
    Tr_teknis_logistik_id: {
        type: String,
    },
    Tr_teknis_task_id:{
        type: String
    },
    Tr_teknis_team: {
        type: Array,
    },
    Tr_teknis_status: {
        enum: ["open", "closed"],
        type: String,
    },
    Tr_teknis_lokasi: {
        type: String,
    },
    Tr_teknis_deleted: {
        type: String,
    },
    Tr_teknis_item: {
        type: String,
    },
    Tr_teknis_keterangan: {
        type: String,   
    },
    Tr_teknis_keterangan_closing: {
        type: String,
    },
    Tr_teknis_company: {
        type: String,
    },
    companyName: {
      type: String
    },
    companyCode: {
      type: Array
    },
    Tr_teknis_created: {
        type: String,
    },
    Tr_teknis_closed: {
        type: String,
    },
    Tr_teknis_user_created: {
        type: String,
    },
    Tr_teknis_user_closed: {
        type: String,
    },
    Tr_teknis_jenis: {
        type: String,
        // enum: ["PSB", "MT", "INFRA", "DISMANTLE"],
    },
    Tr_teknis_work_order_tersedia: {
        type: Array,
    },
    Tr_teknis_work_order_terpakai: {
        type: Array,
    },
    Tr_teknis_work_order_kembali: {
        type: Array,
    },
    Tr_teknis_work_order_retur: {
        type: Array,
    }
}, {
    timestamps: true,
});


const Tr_teknis = mongoose.model("Tr_teknis", Tr_teknisSchema);

module.exports = Tr_teknis;