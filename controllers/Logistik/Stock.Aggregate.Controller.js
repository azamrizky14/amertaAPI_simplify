const SoModel = require("../../models/Logistik/Stock_Opname.Model");

// Ditujukan untuk dashboard Aset & memiliki selisih nilai antara system dan fisik ditambahkan stock mengambang
const StockOpnameAgregateAllAset = async (req, res) => {
  const companyName = req.params.companyName;
  try {
    const result = await SoModel.aggregate([
      { $match: { companyName: companyName } },
      { $sort: { So_tanggal: -1 } },
      { $limit: 1 },
      { $unwind: "$So_item" },
      {
        $project: {
          nama_item: "$So_item.Sh_item_nama",
          item_jumlah: {
            $convert: {
              input: "$So_item.item_jumlah",
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
          item_jumlah_akhir: {
            $convert: {
              input: "$So_item.item_jumlah_akhir",
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
          qty_mengambang: {
            $convert: {
              input: "$So_item.Sh_item_qty_mengambang",
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },

      // 5. Hitung selisih
      {
        $addFields: {
          selisih: {
            $add: [
              { $subtract: ["$item_jumlah", "$item_jumlah_akhir"] },
              "$qty_mengambang",
            ],
          },
        },
      },

      // 6. Format output
      {
        $project: {
          _id: 0,
          nama_item: 1,
          item_jumlah: 1,
          item_jumlah_akhir: 1,
          qty_mengambang: 1,
          selisih: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  StockOpnameAgregateAllAset,
};
