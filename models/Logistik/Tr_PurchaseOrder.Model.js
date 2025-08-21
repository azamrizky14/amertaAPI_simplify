const mongoose = require("mongoose");

const Tr_poSchema = mongoose.Schema({
    Tr_po_id: {
        type: String,
    },
    Tr_po_tanggal: {
        type: String,
    },
    Tr_po_supplier: {
        type: String,
    },
    Tr_po_status: {
        // enum: ["open", "partial", "complete", "canceled"],
        type: String,
    },
    Tr_po_lokasi: {
        type: String,
    },
    Tr_po_deleted: {
        type: String,
    },
    Tr_po_item: {
        type: Array,
    },
    Tr_po_shipment: {
        type: Object,
    },
    Tr_pp_item: {
        type: Array,
    },
    Tr_po_keterangan: {
        type: String,   
    },
    companyName: {
        type: String,
    },
    companyCode: {
        type: Array,
    },
    Tr_po_created: {
        type: String,
    },
    Tr_po_updated: {
        type: Array
    },
    Tr_po_user_created: {
        type: String,
    },
}, {
    timestamps: true,
});


const Tr_po = mongoose.model("Tr_po", Tr_poSchema);

module.exports = Tr_po;