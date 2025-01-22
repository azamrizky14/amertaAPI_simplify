const mongoose = require("mongoose");

const Master_hargamaterialSchema = mongoose.Schema(
  {
    master_harga_material_nama: {
      type: String,
      required: [true, "master_harga_material_nama tolong jangan dikosongi"],
    },
    master_harga_material_domain: {
      type: String,
      required: [true, "master_harga_material_domain TOLONG JANGAN DIKOSONGI"]
    },
    master_harga_material_created: {
      type: String,
      required: [true, "master_harga_material_created TOLONG JANGAN DIKOSONGI"]
    },
    master_harga_material_updated: {
      type: String,
      required: [true, "master_harga_material_updated TOLONG JANGAN DIKOSONGI"]
    },
    master_harga_material_user_updated: {
      type: String,
      required: [true, "master_harga_material_user_updated TOLONG JANGAN DIKOSONGI"]
    },
    master_harga_material_status: {
      type: String,
      required: [true, "master_harga_material_status  TOLONG JANGAN DIKOSONGI"]
    },
    master_harga_material_supplier_list: {
      type: Array,
      "default": []
    }
  },
  {
    timestamps: true,
  }
);


const Master_harga_material = mongoose.model("Master_harga_material", Master_hargamaterialSchema);

module.exports = Master_harga_material;