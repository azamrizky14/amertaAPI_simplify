const mongoose = require("mongoose");

const TrTaskSchema = mongoose.Schema(
    {
        Tr_task_id: {
            type: String,
            required: true
        },
        Tr_task_nama: {
            type: String,
            required: true
        },
        Tr_task_divisi: {
            type: String,
            required: true
        },
        Tr_task_pic: {
            type: Array
        },
        Tr_task_list: {
            type: Array
        },
        Tr_task_created: {
            type: String,
            required: true
        },
        Tr_task_updated: {
            type: Array
        },
        Tr_task_status: {
            type: String,
            enum: ['Y', 'N', 'B', 'C']
        },
        Tr_task_status_completition: {
            type: String,
            required: true
        },
        companyName:{
            type: String
        },
        companyCode:{
            type: Array
        }

    },
    {
        timestamps: true,
    }
);


const TrTask = mongoose.model("TrTask", TrTaskSchema);

module.exports = TrTask;