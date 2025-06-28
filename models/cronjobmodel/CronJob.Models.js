const mongoose = require("mongoose");

// Define your schema
const CronjobSchema = new mongoose.Schema(
  {
    Cronjob_name: {
      type: String,
      required: [true, "Nama tidak boleh kosong"],
    },
    Cronjob_time: {
      type: String,
      required: [true, "Time tidak boleh kosong"],
    },
    Cronjob_status: {
      type: "String",
      enum: ["Y", "N"],
    },
    Cronjob_type: {
      type: String,
      required: [true, "Tipe tidak boleh kosong"],
    },
    Cronjob_newupdate: {
      type: Object,
    },
    Cronjob_created: {
      type: String,
      required: [true, "Tanggal dibuat tidak boleh kosong"],
    },
    Cronjob_updated: {
      type: Array,
    },
    companyName: {
      type: String,
    },
    companyCode: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Cronjob = mongoose.model("Cronjob", CronjobSchema);

module.exports = Cronjob;
