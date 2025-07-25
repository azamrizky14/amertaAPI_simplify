const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema(
  {
    item_id: {
      type: String,
    },
    item_nama: {
      type: String,
    },
    item_tipe: {
      type: String,
      // enum: ['material', 'aset']
    },
    item_list: {
      type: Array
    },
    item_satuan: {
      type: String,
    },
    item_bundle: {
      type: Array
    },
    item_harga: {
      type: Array
    },
    item_keterangan: {
      type: String,
    },
    item_detail: {
      type: Array
    },
    item_brand: {
      type: String,
    },
    item_konversi: {
      type: Array,
    },
    item_gambar: {
      type: String,
    },
    item_user_created: {
      type: String,
    },
    item_created: {
      type: String,
    },
    item_updated: {
      type: String,
    },
    item_deleted: {
      type: String,
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


const Item = mongoose.model("item", ItemSchema);

module.exports = Item;