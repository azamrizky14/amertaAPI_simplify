const Tr_logistic_keluar = require("../models/Tr_logistic_keluar.model");

// GET BY DOMAIN
const getTrLogisticKeluars = async (req, res) => {
  try {
    const TrLogisticKeluars = await Tr_logistic_keluar.find({ Tr_logistic_keluar_domain: req.params.domain, Tr_logistic_keluar_status: "Y" });
    if (TrLogisticKeluars.length > 0) {
      res.status(200).json(TrLogisticKeluars);

    } else {
      res.status(404).json(Pesan = "DATA KOSONG");

    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrLogisticKeluarsByType = async (req, res) => {
  try {
    const type = req.params.type;
    const TrLogisticKeluars = await Tr_logistic_keluar.find({ Tr_logistic_keluar_domain: req.params.domain, Tr_logistic_keluar_status: "Y", Tr_logistic_keluar_type: type });
    if (TrLogisticKeluars.length > 0) {
      res.status(200).json(TrLogisticKeluars);

    } else {
      res.status(404).json(Pesan = "DATA KOSONG");

    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY DOMAIN Transaksi dibatalkan
const getTrLogisticKeluarsDibatalkan = async (req, res) => {
  try {
    const TrLogisticKeluars = await Tr_logistic_keluar.find({ Tr_logistic_keluar_domain: req.params.domain, Tr_logistic_keluar_status: "N" });
    res.status(200).json(TrLogisticKeluars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getTrLogisticKeluar = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogisticKeluar = await Tr_logistic_keluar.findById(id);
    res.status(200).json(TrLogisticKeluar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createTrLogisticKeluar = async (req, res) => {
  try {
    const TrLogisticKeluar = await Tr_logistic_keluar.create(req.body);
    res.status(200).json(TrLogisticKeluar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create with gambar 
const createTrLogisticKeluarGambar = async (req, res) => {
  try {
    const { Tr_logistic_keluar_gambar, ...dynamicFields } = req.body;
    if (!req.file || req.file.length === 0) {
      const newData = new Tr_logistic_keluar({ ...dynamicFields, Tr_logistic_keluar_gambar: "NO-GAMBAR" })
      await newData.save()
    } else {
      const newData = new Tr_logistic_keluar({ ...dynamicFields, Tr_logistic_keluar_gambar: req.file.filename })
      await newData.save()
    }

    res.status(201).json({ message: 'Gambar Sudah terupload' })
  } catch (error) {
    console.error('Gagal menyimpan gambar', error)
    res.status(500).json({ message: error.message })
  }
}

// Updated Logistik 
const updateTrLogisticKeluar = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogisticKeluar = await Tr_logistic_keluar.findByIdAndUpdate(id, req.body);
    if (!TrLogisticKeluar) {
      return res.status(404).json({ message: "TrLogisticKeluar not found" });
    }

    const updatedTrLogisticKeluar = await Tr_logistic_keluar.findById(id);
    res.status(200).json(updatedTrLogisticKeluar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Updated Logistik status tiba 
const updatedTrLogisticKeluarStatustiba = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogisticKeluar = await Tr_logistic_keluar.findByIdAndUpdate(id, {
      Tr_logistic_keluar_status_tiba: "Delivered"
    });

    if (!TrLogisticKeluar) {
      return res.status(404).json({ message: "TrLogisticKeluar tidak ada" });
    }
    const updatedTrLogisticKeluar = await Tr_logistic_keluar.findById(id);
    res.status(200).json(updatedTrLogisticKeluar)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik transaksi dibatalkan
const updatedTrLogisticKeluarTransaksiDibatalkan = async (req, res) => {
  try {
    const { id } = req.params;
    // const ubahtransaksidibatalkan =;
    const TrLogisticKeluar = await Tr_logistic_keluar.findByIdAndUpdate(id, { Tr_logistic_keluar_status: "N" });

    if (!TrLogisticKeluar) {
      return res.status(404).json({ message: "TrLogisticKeluar tidak ada" });
    }
    const updatedTrLogisticKeluar = await Tr_logistic_keluar.findById(id);
    res.status(200).json(updatedTrLogisticKeluar)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function deleteTrLogisticKeluar(req, res) {
  try {
    const { id } = req.params;

    const TrLogisticKeluar = await Tr_logistic_keluar.findByIdAndDelete(id);

    if (!TrLogisticKeluar) {
      return res.status(404).json({ message: "TrLogisticKeluar not found" });
    }

    res.status(200).json({ message: "TrLogisticKeluar deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTrLogisticKeluars,
  getTrLogisticKeluarsByType,
  getTrLogisticKeluarsDibatalkan,
  getTrLogisticKeluar,
  createTrLogisticKeluar,
  createTrLogisticKeluarGambar,
  updateTrLogisticKeluar,
  updatedTrLogisticKeluarStatustiba,
  updatedTrLogisticKeluarTransaksiDibatalkan,
  deleteTrLogisticKeluar,
};
