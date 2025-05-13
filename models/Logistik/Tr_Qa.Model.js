const mongoose = require("mongoose");

const Tr_qaSchema = mongoose.Schema({
    Tr_qa_id: {
        type: String,
    },
    Tr_gr_id: {
        type: String,
    },
    Tr_po_id: {
        type: String,
    },
    Tr_qa_created_date: {
        type: String,
    },
    Tr_qa_inspection_date: {
        type: String,
    },
    Tr_qa_lokasi: {
        type: String,
    },
    Tr_qa_user_inspection: {
        type: String,
    },
    Tr_qa_user_created: {
        type: String,
    },
    Tr_qa_keterangan: {
        type: String,
    },
    Tr_qa_item: {
        type: Array,
    },
    Tr_qa_status: {
        type: String, // Status Antara 0 - 100
    },
    companyName: {
        type: String,
    },
    companyCode: {
        type: Array,
    },
    Tr_qa_deleted: {
        type: String,
    },
}, {
    timestamps: true,
});


const Tr_qa = mongoose.model("Tr_qa", Tr_qaSchema);

module.exports = Tr_qa;