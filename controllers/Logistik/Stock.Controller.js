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
      $or: [
        { Sh_location_to: location },
        { Sh_location_from: location }
      ]
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
          Sh_item_properties: []
        };
      }

      // --- Perhitungan qty ---
      if (item.Sh_location_to === location) {
        stockMap[key].Sh_item_qty += item.Sh_item_qty;
      }

      if (item.Sh_location_from === location) {
        stockMap[key].Sh_item_qty -= item.Sh_item_qty;
      }

      // --- Manajemen properti ---
      if (item.Sh_location_to === location && item.Sh_item_properties?.length) {
        stockMap[key].Sh_item_properties.push(...item.Sh_item_properties);
      }

      if (item.Sh_location_from === location && item.Sh_item_properties?.length) {
        const removeIds = item.Sh_item_properties.map((p) => p.item_properties_id);
        stockMap[key].Sh_item_properties = stockMap[key].Sh_item_properties.filter(
          (p) => !removeIds.includes(p.item_properties_id)
        );
      }
    });

    // --- Deduplikasi Sh_item_properties ---
    const result = Object.values(stockMap).map((item) => {
      const seen = new Set();
      item.Sh_item_properties = item.Sh_item_properties.filter((p) => {
        if (seen.has(p.item_properties_id)) return false;
        seen.add(p.item_properties_id);
        return true;
      });
      return item;
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

const getStockSummaryForSO = async (req, res) => {
  try {
    const { domain, hierarchy } = req.params;

    const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 1);
    const filter = {
      companyCode: newDomain
    };

    const allStock = await Sh.find(filter).lean();

    const skipKeywords = ['External', 'stock-opname', 'floating-', 'installed-'];
    const stockPerLocation = {};

    allStock.forEach((item) => {
      const locations = [
        { key: 'Sh_location_to', qtySign: 1 },
        { key: 'Sh_location_from', qtySign: -1 }
      ];

      locations.forEach(({ key, qtySign }) => {
        const locId = item[key];
        if (!locId) return;

        // Skip jika locId mengandung salah satu keyword
        const shouldSkip = skipKeywords.some(keyword =>
          locId.toLowerCase().includes(keyword.toLowerCase())
        );
        if (shouldSkip) return;

        if (!stockPerLocation[locId]) {
          stockPerLocation[locId] = {
            lokasi_id: locId,
            lokasi_nama: locId, // Ganti jika kamu punya data nama lokasi
            lokasi_item: {}
          };
        }

        const stockMap = stockPerLocation[locId].lokasi_item;

        // Gunakan kombinasi item_id dan item_jenis sebagai key
        const itemKey = `${item.Sh_item_id}_${item.Sh_item_jenis}`;

        if (!stockMap[itemKey]) {
          stockMap[itemKey] = {
            Sh_item_id: item.Sh_item_id,
            Sh_item_nama: item.Sh_item_nama,
            Sh_item_tipe: item.Sh_item_tipe,
            Sh_item_jenis: item.Sh_item_jenis,
            Sh_item_satuan: item.Sh_item_satuan,
            Sh_item_qty: 0,
            Sh_item_properties: []
          };
        }

        // Hitung qty
        stockMap[itemKey].Sh_item_qty += qtySign * item.Sh_item_qty;

        // Tambah properties jika masuk
        if (qtySign > 0 && item.Sh_item_properties?.length) {
          stockMap[itemKey].Sh_item_properties.push(...item.Sh_item_properties);
        }

        // Kurangi properties jika keluar
        if (qtySign < 0 && item.Sh_item_properties?.length) {
          const removeIds = item.Sh_item_properties.map(p => p.item_properties_id);
          stockMap[itemKey].Sh_item_properties = stockMap[itemKey].Sh_item_properties.filter(
            p => !removeIds.includes(p.item_properties_id)
          );
        }
      });
    });

    // Konversi hasil akhir ke format array dan deduplikasi properties
    const result = Object.values(stockPerLocation).map((lokasi) => {
      lokasi.lokasi_item = Object.values(lokasi.lokasi_item).map((item) => {
        const seen = new Set();
        item.Sh_item_properties = item.Sh_item_properties.filter((p) => {
          if (seen.has(p.item_properties_id)) return false;
          seen.add(p.item_properties_id);
          return true;
        });
        return item;
      });
      return lokasi;
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "DATA KOSONG" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating stock per lokasi:", error);
    return res.status(500).json({ message: error.message });
  }
};


// CREATE
const createStockSh = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      await Promise.all(req.body.map(data => Sh.create(data)));
    }
    res.status(200).json('Create Stock History Berhasil');
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
      const currentNumber = parseInt(
        currentItem.So_id.split("-").pop() || "0"
      );
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
  getSoPrefix,
  createSo,
};
