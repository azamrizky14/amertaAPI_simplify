const mongoose = require("mongoose");

const Tr_rabSchema = mongoose.Schema(
  {
    Tr_rab_nama: {
      type: String,
    },
    Tr_rab_kategori: {
      type: String,
    },
    Tr_rab_pic: {
      type: Array,
      default: [],
    },
    Tr_rab_kebutuhan: {
      type: Array,
      default: [],
    },
    Tr_rab_total_harga: {
      type: String,
      required: true,
    },
    Tr_rab_progress: {
      type: Array,
      default: [],
    },
    Tr_rab_image_invoice: {
      type: String,
    },
    Tr_rab_status: {
      type: String,
    },
    Tr_rab_created: {
      type: String,
    },
    Tr_rab_updated: {
      type: Array,
      default:[]
    },
    companyName: {
      type: String,
    },
    companyCode: {
      type: Array,
    }
  },
  {
    timestamps: true,
  }
);

const Tr_rab = mongoose.model("Tr_rab", Tr_rabSchema);

module.exports = Tr_rab;
