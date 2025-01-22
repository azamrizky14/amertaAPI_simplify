const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema(
  {
    lokasi_id: {
      type: String,
    },
    lokasi_nama: {
      type: String,
    },
    lokasi_tipe: {
      type: String,
      // enum: ['gudang', 'ruang', 'rak']
    },
    lokasi_alamat: {
      type: Object,
    },
    lokasi_keterangan: { 
      type: String,
    },
    lokasi_detail: {
      type: Object,
      default: {}, // Optional: Provide a default value 
    },
    lokasi_user_created: {
      type: String,
    },
    lokasi_created: {
      type: String,
    },
    lokasi_updated: {
      type: String,
    },
    lokasi_deleted: {
      type: String,
    },
    companyName: {
      type: String
    }
},
  {
    timestamps: true,
  }
);


const Location = mongoose.model("lokasi", LocationSchema);

module.exports = Location;