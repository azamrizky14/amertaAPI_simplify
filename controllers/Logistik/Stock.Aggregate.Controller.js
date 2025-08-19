const SoModel = require("../../models/Logistik/Stock_Opname.Model");
const SoHistories = require("../../models/Logistik/Stock_History.Model");

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

const StockHistoriesInOut = async (req, res) => {
  const { companyName, startDate, endDate } = req.query;
  try {
    const pipeline = [
      {
        $match: {
          companyName: companyName,
          Sh_created_date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            nama: "$Sh_item_nama",
            jenis: "$Sh_item_jenis",
            tipe: "$Sh_item_tipe",
            satuan: "$Sh_item_satuan",
            type_transaksi: "$Sh_type",
          },
          total_qty: { $sum: "$Sh_item_qty" },
          jumlah_transaksi: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          item_nama: "$_id.nama",
          item_jenis: "$_id.jenis",
          item_tipe: "$_id.tipe",
          satuan: "$_id.satuan",
          type_transaksi: "$_id.type_transaksi",
          total_qty: 1,
          jumlah_transaksi: 1,
        },
      },
      {
        $sort: { item_nama: 1 },
      },
    ];
    const result = await SoHistories.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  StockOpnameAgregateAllAset,
  StockHistoriesInOut,
};
