const Tr_teknis = require("../../models/Teknis/Tr_teknis.Model");

const TrTeknisAgregatePerolehanTeknisi = async (req, res) => {
  try {
    const { companyName, userName, startDate, endDate } = req.query;
    const result = await Tr_teknis.aggregate([
      {
        $match: {
          companyName: companyName,
          "Tr_teknis_work_order_terpakai.Tr_teknis_team": userName,
          Tr_teknis_tanggal: {
            $gt: startDate,
            $lt: endDate,
          },
          Tr_teknis_work_order_terpakai: {
            $exists: true,
            $not: { $size: 0 },
          },
        },
      },
      {
        $project: {
          jumlah_terpakai: {
            $size: "$Tr_teknis_work_order_terpakai",
          },
        },
      },
      {
        $group: {
          _id: null,
          jumlah_tiket_selesai: {
            $sum: "$jumlah_terpakai",
          },
        },
      },
      {
        $project: {
          nama_teknisi: userName,
          jumlah_tiket_sukses: "$jumlah_tiket_selesai",
        },
      },
    ]);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const TrTeknisAgregateListPerolehanTeknisi = async (req, res) => {
  const { companyName, startDate, endDate } = req.query;
  try {
    const result = await Tr_teknis.aggregate([
      {
        $match: {
          companyName: companyName,
          "Tr_teknis_work_order_terpakai.Tr_teknis_team": {
            $exists: true,
            $not: { $size: 0 },
          },
          Tr_teknis_work_order_terpakai: {
            $exists: true,
            $not: { $size: 0 },
          },
          Tr_teknis_tanggal: {
            $gt: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $project: {
          list_ticket: {
            $size: "$Tr_teknis_work_order_terpakai",
          },
          team: "$Tr_teknis_work_order_terpakai.Tr_teknis_team",
        },
      },
    ]);
    const namecount = {};
    result.forEach((item) => {
      item.team.forEach((subArray) => {
        subArray.forEach((name) => {
          let finalname = null;
          if (typeof name === "string") {
            finalname = name;
          } else if (typeof name === "object" && name !== null && name.name) {
            finalname = name.name;
          }
          if (finalname) {
            namecount[finalname] = (namecount[finalname] || 0) + 1;
          } else {
            console.warn("Bukan String", name.length);
          }
        });
      });
    });
    const finalresult = Object.entries(namecount).map(([name, count]) => ({
      name,
      count,
    }));
    if (result.length > 0) {
      res.status(200).json(finalresult);
    } else {
      res.status(404).json({ message: "Tidak ada data1" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const TrTeknisAgregateListDurasiPenyelesaianAVG = async (req, res) => {
  const { companyName, startDate, endDate, status } = req.query;

  try {
    const matchStage = {
      Tr_teknis_tanggal: { $gt: startDate, $lt: endDate },
      Tr_teknis_work_order_terpakai: { $exists: true, $not: { $size: 0 } },
    };

    if (companyName !== "all") {
      matchStage.companyName = companyName;
    }

    const result = await Tr_teknis.aggregate([
      {
        $match: matchStage,
      },
      { $unwind: "$Tr_teknis_work_order_terpakai" },
      {
        $addFields: {
          nama_teknisi: "$Tr_teknis_work_order_terpakai.Tr_teknis_team",
          start_raw: "$Tr_teknis_work_order_terpakai.Tr_teknis_progres_start",
          end_raw: "$Tr_teknis_work_order_terpakai.Tr_teknis_progres_end",
        },
      },
      {
        $match: {
          start_raw: { $regex: /^\d{2}:\d{2}$/ },
          end_raw: { $regex: /^\d{2}:\d{2}$/ },
        },
      },
      {
        $addFields: {
          startDate: {
            $dateFromString: {
              dateString: { $concat: ["2024-01-01T", "$start_raw", ":00"] },
              format: "%Y-%m-%dT%H:%M:%S",
            },
          },
          endDate: {
            $dateFromString: {
              dateString: { $concat: ["2024-01-01T", "$end_raw", ":00"] },
              format: "%Y-%m-%dT%H:%M:%S",
            },
          },
        },
      },
      {
        $addFields: {
          durasi_jam: {
            $divide: [
              { $subtract: ["$endDate", "$startDate"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      { $unwind: "$nama_teknisi" },
      {
        $group: {
          _id: "$nama_teknisi",
          jumlah_tiket: { $sum: 1 },
          total_durasi: { $sum: "$durasi_jam" },
        },
      },
      {
        $project: {
          _id: 0,
          nama_teknisi: "$_id",
          jumlah_tiket: 1,
          rata_rata: {
            $round: [{ $divide: ["$total_durasi", "$jumlah_tiket"] }, 2],
          },
          total: "$total_durasi",
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("Aggregation Error:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan saat agregasi." });
  }
};

const TrTeknisAgregateListTicket = async (req, res) => {
  const { companyName, startDate, endDate} = req.query;
  try {
    const filter = {Tr_teknis_created: {
            $gt: startDate,
            $lt: endDate,
          }}
          if (companyName !== "all") {
            filter.companyName = companyName;
          }
    const result = await Tr_teknis.aggregate([
      {
        $match: filter,
      },
      {
        $unwind: "$Tr_teknis_work_order_terpakai",
      },
      { 
        $group: {
          _id: "$Tr_teknis_work_order_terpakai._id",
          Tr_teknis_pelanggan_id: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_pelanggan_id",
          },
          companyName: { $first: "$companyName" }, // ambil langsung dari root
          Tr_teknis_kategori: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_kategori",
          },
          Tr_teknis_pelanggan_nama: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_pelanggan_nama",
          },
          Tr_teknis_pelanggan_server: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_pelanggan_server",
          },
          Tr_teknis_user_updated: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_user_updated",
          },
          Tr_teknis_alamat: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_alamat",
          },
          Tr_teknis_titik_koordinat: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_titik_koordinat",
          },
          Tr_teknis_keterangan: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_keterangan",
          },
          Tr_teknis_created: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_created",
          },
          Tr_teknis_tanggal: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_tanggal",
          },
          Tr_teknis_trouble: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_trouble",
          },
          Tr_teknis_action: {
            $first: "$Tr_teknis_work_order_terpakai.Tr_teknis_action",
          },
        },
      },
    ]);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.log({ message: error.message });
  }
};

module.exports = {
  TrTeknisAgregatePerolehanTeknisi,
  TrTeknisAgregateListPerolehanTeknisi,
  TrTeknisAgregateListDurasiPenyelesaianAVG,
  TrTeknisAgregateListTicket,
};
