const mongoose = require("mongoose");

// Define your schema
const announcementSchema = new mongoose.Schema(
  {
    Announcement_id: {
      type: String,
      required: [true, "ID tidak boleh kosong"],
    },
    Announcement_name: {
      type: String,
      required: [true, "Nama Pengumuman tidak boleh kosong"],
    },
    Announcement_port:{
      type: String,
      required: [true, "PORT Pengumuman tidak boleh kosong"]
    },
    Announcement_category: {
      type: String,
      required: [true, "Kategori Pengumuman tidak boleh kosong"],
    },
    Announcement_status: {
      type: String,
      required: [true, "Status Pengumuman tidak boleh kosong"],
    },
    Announcement_list: {
      type: Array,
    },
    Announcement_message: {
      type: String,
    },
    Announcement_created: {
      type: String,
      required: [true, "Tanggal dibuat tidak boleh kosong"],
    },
    Announcement_updated: {
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

const Announcement = mongoose.model("announcement", announcementSchema);

module.exports = Announcement;
