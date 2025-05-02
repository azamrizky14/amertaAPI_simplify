const mongoose = require("mongoose");

const SoSchema = mongoose.Schema({
    So_id: {
        type: String,
    },
    So_lokasi: {
        type: String,
    },
    So_tanggal: {
        type: String, 
    },
    So_user: {
        type: String,
    },
    So_item: {
        type: Array,
    },
    So_keterangan: {
        type: String,
    },
    companyName: {
        type: String, 
    },
    companyCode: {
        type: Array,
    },
    So_deleted: {
        type: String,
    },
}, {
    timestamps: true,
});


const So = mongoose.model("Stock_opname", SoSchema);

module.exports = So;