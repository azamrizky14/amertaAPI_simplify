const Item = require("../../models/Umum/Item.Models");

const getMasterItemAgregateInOut = async (req, res) => {
  try {
    const { startDate, endDate, companyName } = req.query;
    
    const matchStage = {
          // createdAt: {
          //   $gte: new Date(startDate),
          //   $lte: new Date(endDate),
          // },
    };

    if (companyName !== 'all') {

      matchStage.companyName = companyName;
    }
    const pipeline = [
      {
        $match: matchStage
      },
      { $unwind: "$item_detail" },
      {
        $addFields: {
          masukFiltered: {
            $filter: {
              input: "$item_detail.item_detail_history_masuk",
              as: "masuk",
              cond: {
                $and: [
                  {
                    $gte: [
                      { $toDate: "$$masuk.item_detail_history_masuk_tgl" },
                      new Date(startDate),
                    ],
                  },
                  {
                    $lte: [
                      { $toDate: "$$masuk.item_detail_history_masuk_tgl" },
                      new Date(endDate),
                    ],
                  },
                ],
              },
            },
          },
          keluarFiltered: {
            $filter: {
              input: "$item_detail.item_detail_history_keluar",
              as: "keluar",
              cond: {
                $and: [
                  {
                    $gte: [
                      {
                        $toDate: "$$keluar.item_detail_history_keluar_tanggal",
                      },
                      new Date(startDate),
                    ],
                  },
                  {
                    $lte: [
                      {
                        $toDate: "$$keluar.item_detail_history_keluar_tanggal",
                      },
                      new Date(endDate),
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          item_kode: "$item_detail.item_detail_item_kode",
          item_price: "$item_detail.item_detail_item_price",
          item_nama: "$item_nama",
          item_detail_nama: "$item_detail.item_detail_item_nama",
          item_tipe: "$item_tipe",
          item_satuan: "$item_detail.item_detail_satuan",
          total_item_saat_ini: "$item_detail.item_detail_quantity",
          totalMasuk: {
            $sum: {
              $map: {
                input: "$masukFiltered",
                as: "m",
                in: { $toInt: "$$m.item_detail_history_quantity" },
              },
            },
          },
          totalKeluar: {
            $sum: {
              $map: {
                input: "$keluarFiltered",
                as: "k",
                in: { $toInt: "$$k.item_detail_history_quantity" },
              },
            },
          },
        },
      },
    ];
    const result = await Item.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMasterItemAgregateInOut,
};
