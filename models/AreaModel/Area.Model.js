const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    AreaId:{
        type: String,
        required: true,
    },
    AreaName:{
        type: String,
        required: true,
    },
    ValidFrom :{
        type: String,
        required: true,
    },
    ValidTo:{
        type:String,
        required:true
    },
    AreaArray:{
        type:Array,
        default:[]
    },
    AreaMember:{
        type:Array,
        default:[]
    },
    Created: {
        CreatedBy: { type: String, default: "System" },
        CreatedAt: { type: Date, default: Date.now },
    },
    Status: { type: String, required: true },
    Updated: [
        {
            UpdatedBy: { type: String, default: "System" },
            UpdatedAt: { type: Date, default: Date.now },
        }
    ],
    CompanyName: { type: String, required: true },
})

const Area = mongoose.model('Area', AreaSchema);

module.exports = Area;