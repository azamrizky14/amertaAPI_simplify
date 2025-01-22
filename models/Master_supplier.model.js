const mongoose = require("mongoose");

const Master_supplierSchema = mongoose.Schema(
  {
    master_supplier_nama: {
      type: String,
      required: [true, "NAMA SUPPLIER TOLONG JANGAN DIKOSONGI"],
    },

    master_supplier_status: {
      type: String,
      required: [true, "STATUS SUPPLIER TOLONG JANGAN DIKOSONGI"],
    },

    master_supplier_alamat: {
        type: String,
        required: [true, "ALAMAT SUPPLIER TOLONG JANGAN DIKOSONGI"]
    },

    master_supplier_toko: {
      type: String,
      required: [true, "TOKO SUPPLIER TOLONG JANGAN DIKOSONGI"],
    },
    master_supplier_toko_status:{
        type:String,
        required:[true, "STATUS TOKO TOLONG JANGAN DIKOSONGI"]
    },
    master_supplier_created:{
        type:String,
        required:[true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_supplier_updated:{
        type:String,
        required:[true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_supplier_user_updated:{
        type:String,
        required:[true, "TOLONG JANGAN DIKOSONGI"]
    },
    master_supplier_phone:{
      type:String,
      required:[true, "TOLONG JANGAN DIKOSONGI"]
  }
  },
  {
    timestamps: true,
  }
);


const Master_supplier = mongoose.model("Master_supplier", Master_supplierSchema);

module.exports = Master_supplier;