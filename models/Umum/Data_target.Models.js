const mongoose = require("mongoose");

// Define your schema
const datatargetSchema = new mongoose.Schema({
  // Define your schema fields
  // For example:
  Data_target_name: {
    type: String,
    required: [true, "Target Nama jangan dikosongi"],
  },
  Data_target_division: {
    type: String,
    required: [true, "Divisi jangan dikosongi"],
  },
  Data_target_detail:{
    type: Object,
    default:{}
  },
  Data_target_status:{
    type: String,
    required:[true, "Status Jangan dikosongi"]
  },
  Data_target_created:{
    type: String,
    required:[true, "Tanggal dibuat jangan dikosongi"]
  },
  Data_target_updated:{
    type:Array,
    default:[]
  },
  companyName:{
    type:String,
    required:[true, "CompanyName jangan dikosongi"]
  }
});

const DataTarget = mongoose.model("Data_Target", datatargetSchema);

module.exports = DataTarget;
