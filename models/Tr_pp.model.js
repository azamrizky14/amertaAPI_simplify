const mongoose = require("mongoose");

const Tr_ppSchema = mongoose.Schema({
    Tr_pp_id: {
        type: String,
    },
    Tr_po_id: {
        type: String,
    },
    Tr_pp_payment_date: {
        type: String,
    },
    Tr_pp_payment_amount: {
        type: Number,
    },
    Tr_pp_payment_detail: {
        type: Object,
    },
    Tr_pp_payment_method: {
        type: String,
    },
    Tr_pp_shipment: {
        type: Object,
    },
    Tr_pp_status: {
        // enum: ["open", "partial", "complete", "canceled"],
        type: String,
    },
    Tr_pp_image: {
        type: String,
    },
    Tr_pp_deleted: {
        type: String,
    },
    companyName: {
        type: String,
    },
    companyCode: {
        type: Array,
    },
    Tr_pp_created_date: {
        type: String,
    },
    Tr_pp_user_created: {
        type: String,
    },
    Tr_pp_user_paid: {
        type: String,
    },
}, {
    timestamps: true,
});


const Tr_pp = mongoose.model("Tr_pp", Tr_ppSchema);

module.exports = Tr_pp;