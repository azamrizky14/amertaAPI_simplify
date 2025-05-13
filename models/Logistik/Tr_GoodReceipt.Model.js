const mongoose = require("mongoose");

const Tr_grSchema = mongoose.Schema({
    Tr_gr_id: {
        type: String,
    },
    Tr_po_id: {
        type: String,
    },
    Tr_gr_created_date: {
        type: String,
    },
    Tr_gr_receipt_date: {
        type: String,
    },
    Tr_gr_item: {
        type: Array,
    },
    Tr_gr_keterangan: {
        type: String,   
    },
    Tr_gr_status: {
        // enum: ["open", "partial", "complete", "canceled"],
        type: String,
    },
    Tr_gr_deleted: {
        type: String,
    },
    Tr_gr_image: {
        type: String,
    },
    Tr_gr_no_resi: {
        type: String,
    },
    companyName: {
        type: String,
    },
    companyCode: {
        type: Array,
    },
    Tr_gr_user_created: {
        type: String,
    },
    Tr_gr_qa_status: {
        type: String,
    },
}, {
    timestamps: true,
});


const Tr_gr = mongoose.model("Tr_gr", Tr_grSchema);

module.exports = Tr_gr;