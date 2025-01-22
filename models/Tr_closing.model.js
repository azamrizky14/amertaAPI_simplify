const mongoose = require("mongoose");

const Tr_closingSchema = mongoose.Schema({
    Tr_closing_domain: {
        type: String,
        required: [true, "domain tolong jangan dikosongi"],
    },
    Tr_closing_bulan: {
        type: String,
        required: [true, "bulan tolong jangan dikosongi"],
    },
    Tr_closing_pic: {
        type: String,
        required: [true, "Pic tolong jangan dikosongi"]
    },
    Tr_closing_status: {
        type: String,
        required: [true, "status tolong jangan dikosongi"],
    },
    Tr_closing_total: {
        type: Object
    },
    Tr_closing_created: {
        type: String,
        required: [true, "Created tolong jangan dikosongi"],
    },
    Tr_closing_user_updated: {
        type: String,
        required: [true, "User update tolong jangan dikosongi"],
    }
}, {
    timestamps: true,
});


const Tr_closing = mongoose.model("Tr_closing", Tr_closingSchema);

module.exports = Tr_closing;