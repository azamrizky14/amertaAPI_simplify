const mongoose = require("mongoose");
const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// SH & SO Controller
const Sh = require("../../models/Logistik/Stock_History.Model");
const So = require("../../models/Logistik/Stock_Opname.Model");

// GET BY DOMAIN
const getStockSh = async (req, res) => {
  try {
    const { domain, hierarchy } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Fetch the data based on the dynamic filter
    const StockSh = await Sh.find(filter);

    // Check if any data was found
    if (StockSh.length > 0) {
      const reversedData = StockSh.reverse();
      return res.status(200).json(reversedData);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getStockSummaryByLocation = async (req, res) => {
  try {
    const { domain, hierarchy, location } = req.params;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = {
      companyCode: newDomain,
      $or: [{ Sh_location_to: location }, { Sh_location_from: location }],
      $nor: [
        {
          Sh_location_from: { $regex: "^floating-" },
          Sh_location_to: { $regex: "^installed-" },
        },
        {
          Sh_location_from: { $regex: "^installed-" },
          Sh_location_to: { $regex: "^floating-" },
        },
      ],
    };

    const allStock = await Sh.find(filter);

    const stockMap = {};

    allStock.forEach((item) => {
      const key = `${item.Sh_item_id}__${item.Sh_item_jenis}`;
      if (!stockMap[key]) {
        stockMap[key] = {
          Sh_item_id: item.Sh_item_id,
          Sh_item_nama: item.Sh_item_nama,
          Sh_item_tipe: item.Sh_item_tipe,
          Sh_item_jenis: item.Sh_item_jenis,
          Sh_item_satuan: item.Sh_item_satuan,
          Sh_item_qty: 0,
          Sh_item_properties: [],
        };
      }

      const isIn = item.Sh_location_to === location;
      const isOut = item.Sh_location_from === location;
      const isKabel = item.Sh_item_tipe === "Kabel";
      const isModemOrTiang =
        item.Sh_item_tipe === "Modem" || item.Sh_item_tipe === "Tiang";

      // --- Perhitungan qty utama ---
      if (!isKabel && !isModemOrTiang) {
        if (isIn) stockMap[key].Sh_item_qty += item.Sh_item_qty;
        if (isOut) stockMap[key].Sh_item_qty -= item.Sh_item_qty;
      }

      // --- Perhitungan properti ---
      if (item.Sh_item_properties?.length) {
        item.Sh_item_properties.forEach((prop) => {
          const existingProp = stockMap[key].Sh_item_properties.find(
            (p) => p.item_properties_id === prop.item_properties_id
          );

          if (isKabel) {
            // Untuk Kabel: update qty di properti
            if (isIn) {
              if (existingProp) {
                existingProp.item_properties_qty += prop.item_properties_qty;
              } else {
                stockMap[key].Sh_item_properties.push({ ...prop });
              }
            }
            if (isOut) {
              if (existingProp) {
                existingProp.item_properties_qty -= prop.item_properties_qty;
                if (existingProp.item_properties_qty <= 0) {
                  stockMap[key].Sh_item_properties = stockMap[
                    key
                  ].Sh_item_properties.filter(
                    (p) => p.item_properties_id !== prop.item_properties_id
                  );
                }
              }
            }
          } else if (isModemOrTiang) {
            // Untuk Modem dan Tiang: hanya tambahkan atau hapus berdasarkan in/out
            if (isIn && !existingProp) {
              stockMap[key].Sh_item_properties.push({ ...prop });
            }
            if (isOut) {
              stockMap[key].Sh_item_properties = stockMap[
                key
              ].Sh_item_properties.filter(
                (p) => p.item_properties_id !== prop.item_properties_id
              );
            }
          } else {
            // Untuk item lainnya
            if (isIn && !existingProp) {
              stockMap[key].Sh_item_properties.push({ ...prop });
            }
            if (isOut) {
              stockMap[key].Sh_item_properties = stockMap[
                key
              ].Sh_item_properties.filter(
                (p) => p.item_properties_id !== prop.item_properties_id
              );
            }
          }
        });
      }

      // --- Update qty utama untuk Kabel dan Modem/Tiang berdasarkan properti ---
      if (isKabel || isModemOrTiang) {
        stockMap[key].Sh_item_qty = stockMap[key].Sh_item_properties.length;
      }
    });

    const result = Object.values(stockMap);

    if (result.length === 0) {
      return res.status(404).json({ message: "DATA KOSONG" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating stock summary:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getStockSummaryForSO = async (req, res) => {
  try {
    const { domain, hierarchy } = req.params;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);

    const skipKeywords = [
      "External",
      "stock-opname",
      "floating-",
      "installed-",
    ];

    const allStock = await Sh.find({
      companyCode: newDomain,
    });

    const stockPerLocation = {};

    allStock.forEach((item) => {
      const { Sh_location_to, Sh_location_from } = item;
      const isKabel = item.Sh_item_tipe === "Kabel";
      const isModemOrTiang =
        item.Sh_item_tipe === "Modem" || item.Sh_item_tipe === "Tiang";

      const locations = [Sh_location_from, Sh_location_to];

      locations.forEach((locId, index) => {
        const isIn = index === 1;
        const isOut = index === 0;

        if (!locId) return;

        if (!stockPerLocation[locId]) {
          stockPerLocation[locId] = {
            lokasi_id: locId,
            lokasi_nama: locId,
            lokasi_item: {},
          };
        }

        const key = `${item.Sh_item_id}__${item.Sh_item_jenis}`;
        if (!stockPerLocation[locId].lokasi_item[key]) {
          stockPerLocation[locId].lokasi_item[key] = {
            Sh_item_id: item.Sh_item_id,
            Sh_item_nama: item.Sh_item_nama,
            Sh_item_tipe: item.Sh_item_tipe,
            Sh_item_jenis: item.Sh_item_jenis,
            Sh_item_satuan: item.Sh_item_satuan,
            Sh_item_qty: 0,
            Sh_item_properties: [],
          };
        }

        const currentItem = stockPerLocation[locId].lokasi_item[key];

        // --- Logika Qty Utama ---
        if (!isKabel && !isModemOrTiang) {
          if (isIn) currentItem.Sh_item_qty += item.Sh_item_qty;
          if (isOut) currentItem.Sh_item_qty -= item.Sh_item_qty;
        }

        // --- Logika Properti ---
        if (item.Sh_item_properties?.length) {
          item.Sh_item_properties.forEach((prop) => {
            const existingProp = currentItem.Sh_item_properties.find(
              (p) => p.item_properties_id === prop.item_properties_id
            );

            if (isKabel) {
              if (isIn) {
                if (existingProp) {
                  existingProp.item_properties_qty += prop.item_properties_qty;
                } else {
                  currentItem.Sh_item_properties.push({ ...prop });
                }
              }

              if (isOut) {
                if (existingProp) {
                  existingProp.item_properties_qty -= prop.item_properties_qty;
                  if (existingProp.item_properties_qty <= 0) {
                    currentItem.Sh_item_properties =
                      currentItem.Sh_item_properties.filter(
                        (p) => p.item_properties_id !== prop.item_properties_id
                      );
                  }
                }
              }
            } else if (isModemOrTiang) {
              if (isIn && !existingProp) {
                currentItem.Sh_item_properties.push({ ...prop });
              }

              if (isOut) {
                currentItem.Sh_item_properties =
                  currentItem.Sh_item_properties.filter(
                    (p) => p.item_properties_id !== prop.item_properties_id
                  );
              }
            } else {
              if (isIn && !existingProp) {
                currentItem.Sh_item_properties.push({ ...prop });
              }

              if (isOut) {
                currentItem.Sh_item_properties =
                  currentItem.Sh_item_properties.filter(
                    (p) => p.item_properties_id !== prop.item_properties_id
                  );
              }
            }
          });
        }

        // --- Update qty berdasarkan properti untuk Kabel, Modem, Tiang ---
        if (isKabel || isModemOrTiang) {
          currentItem.Sh_item_qty = currentItem.Sh_item_properties.length || 0;
        }
      });
    });

    // --- Filter lokasi akhir yang tidak perlu ditampilkan ---
    const result = Object.values(stockPerLocation)
      .filter(
        (lokasi) =>
          !skipKeywords.some((keyword) =>
            lokasi.lokasi_id.toLowerCase().includes(keyword.toLowerCase())
          )
      )
      .map((lokasi) => {
        lokasi.lokasi_item = Object.values(lokasi.lokasi_item).map((item) => {
          if (item.Sh_item_jenis !== "Kabel") {
            const seen = new Set();
            item.Sh_item_properties = item.Sh_item_properties.filter((p) => {
              if (seen.has(p.item_properties_id)) return false;
              seen.add(p.item_properties_id);
              return true;
            });
          }
          return item;
        });
        return lokasi;
      });

    if (result.length === 0) {
      return res.status(404).json({ message: "DATA KOSONG" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating stock summary:", error);
    return res.status(500).json({ message: error.message });
  }
};

// CREATE
const createStockSh = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      await Promise.all(req.body.map((data) => Sh.create(data)));
    }
    res.status(200).json("Create Stock History Berhasil");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStockSo = async (req, res) => {
  try {
    const { domain, hierarchy } = req.params;

    // Create a filter object dynamically
    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = { companyCode: newDomain };

    // Fetch the data based on the dynamic filter
    const StockSh = await So.find(filter);

    // Check if any data was found
    if (StockSh.length > 0) {
      const reversedData = StockSh.reverse();
      return res.status(200).json(reversedData);
    } else {
      return res.status(404).json({ message: "DATA KOSONG" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};
// Get Detail
const getStockSoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };

    const MasterItem = await So.findById(filter);
    res.status(200).json(MasterItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createSo = async (req, res) => {
  try {
    const Sopname = await So.create(req.body);
    res.status(200).json(Sopname);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BON PREFIX
const getSoPrefix = async (req, res) => {
  try {
    const { date } = req.params;

    const newDate = date.replace(/-/g, "");
    // Buat prefix berdasarkan parameter `type` dan `date`
    const prefix = `SO-${newDate}`;

    // Cari semua dokumen yang memiliki prefix sesuai di database
    const data = await So.find({
      So_id: { $regex: `^${prefix}` },
    });

    // Jika tidak ada data dengan prefix tersebut, kembalikan ID pertama dengan angka '001'
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }

    // Cari ID dengan angka terbesar dari hasil query
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(currentItem.So_id.split("-").pop() || "0");
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.So_id : maxId;
    }, "");

    // Ambil angka dari ID terbaru dan tambahkan 1
    const latestNumber = parseInt(latestId.split("-").pop() || "0");
    const nextNumber = (latestNumber + 1).toString().padStart(3, "0");

    // Gabungkan prefix dengan angka yang baru
    const nextId = `${prefix}-${nextNumber}`;

    // Kembalikan hasilnya
    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Stock
  getStockSh,
  getStockSummaryByLocation,
  getStockSummaryForSO,
  createStockSh,

  getStockSo,
  getStockSoDetail,
  getSoPrefix,
  createSo,
};
