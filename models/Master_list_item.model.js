const mongoose = require("mongoose");

const Master_list_itemSchema = mongoose.Schema(
    {
        item_list_nama: {
            type: String,
            required: [true, "NAMA ITEM TOLONG JANGAN DIKOSONGI"],
        },
        item_list_domain: {
            type: String,
            required: [true, "ITEM DOMAIN TOLONG JANGAN DIKOSONGI"]
        },
        item_list_kode_sn: {
            type: String,
            required: [true, "ITEM DOMAIN TOLONG JANGAN DIKOSONGI"]
        },
        item_list_harga: {
            type: String,
            required: [true, "ITEM HARGA TOLONG JANGAN DIKOSONGI"],
        },
        item_list_created: {
            type: String,
            required: [true, "ITEM CREATED TOLONG JANGAN DIKOSONGI"]
        },
        item_list_updated: {
            type: String,
            required: [true, "ITEM UPDATED TOLONG JANGAN DIKOSONGI"]
        },
        item_list_user_updated: {
            type: String,
            required: [true, "ITEM USER UPDATED TOLONG JANGAN DIKOSONGI"]
        },
        item_list_status: {
            type: String,
            required: [true, "ITEM STATUS TOLONG JANGAN DIKOSONGI"]
        },
        item_list_status_pemakaian: {
            type: String,
            required: [true, "ITEM STATUS PEMAKAIAN TOLONG JANGAN DIKOSONGI"]
        },
        /// History alokasi,penjualan,pemakaian,pengeluaran 
        item_list_history: {
            type: Array,
            "default": []
        },
        item_list_qc: {
            type: Array,
            "default": []
        },
        item_list_gambar: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);


const Master_list_item = mongoose.model("Master_item_list", Master_list_itemSchema);

module.exports = Master_list_item;