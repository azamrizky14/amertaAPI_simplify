const mongoose = require("mongoose");

const ShSchema = mongoose.Schema({
    Sh_item_id: {
        type: String,
    },
    Sh_item_nama: {
        type: String,
    },
    Sh_item_jenis: {
        type: String, 
    },
    Sh_item_tipe: {
        type: String, 
    },
    Sh_item_qty: {
        type: Number,
    },
    Sh_item_satuan: {
        type: String,
    },
    Sh_item_properties: {
        type: Object,
    },
    Sh_item_status: {
        type: Object,
    },
    Sh_type: {
        // enum: ['in', 'out', 'transfer'],
        type: String, 
    },
    Sh_location_from: {
        type: String, 
    },
    Sh_location_to: {
        type: String, 
    },
    Sh_source: {
        type: String, 
    },
    Sh_source_id: {
        type: String, 
    },
    companyName: {
        type: String,
    },
    Sh_keterangan: {
        type: String, 
    },
    Sh_created_date: {
        type: String, 
    },
    Sh_user_created: {
        type: String, 
    },
    companyCode: {
        type: Array,
    },
    Sh_deleted: {
        type: String,
    },
}, {
    timestamps: true,
});


const Sh = mongoose.model("Stock_history", ShSchema);

module.exports = Sh;