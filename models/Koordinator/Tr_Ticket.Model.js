const mongoose = require("mongoose");

const TrTicketSchema = mongoose.Schema(
    {
        Tr_ticket_id: {
            type: String,
            required: true
        },
        Tr_ticket_name: {
            type: String,
            required: true
        },
        Tr_ticket_status: {
            type: String,
            enum: ['Y', 'N', 'B', 'C']
        },
        Tr_ticket_kategori: {
            type: String,
            required: true
        },
        Tr_ticket_data_pelanggan: {
            type: Object,
            default: '{}'
        },
        Tr_ticket_completition_history:{
            type: Array
        },
        Tr_ticket_alamat: {
            type: Object,
            default: '{}'
        },
        Tr_ticket_keterangan: {
            type: String
        },
        Tr_ticket_created: {
            type: String,
            required: true
        },
        Tr_ticket_updated: {
            type: Array
        },
        companyName: {
            type: String
        },
        companyCode: {
            type: Array
        }

    },
    {
        timestamps: true,
    }
);


const TrTicket = mongoose.model("TrTicket", TrTicketSchema);

module.exports = TrTicket;