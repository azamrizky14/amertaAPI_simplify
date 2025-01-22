const Tr_logistic = require("../models/Tr_logistic.model");

// GET BY DOMAIN
const getTrLogistics = async (req, res) => {
  try {
    const TrLogistics = await Tr_logistic.find({
      Tr_logistic_domain: req.params.domain,
      Tr_logistic_status: "Y",
    });
    if (TrLogistics.length > 0) {
      res.status(200).json(TrLogistics);
    } else {
      res.status(404).json((Pesan = "DATA KOSONG"));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY DOMAIN Transaksi dibatalkan
const getTrLogisticsDibatalkan = async (req, res) => {
  try {
    const TrLogistics = await Tr_logistic.find({
      Tr_logistic_domain: req.params.domain,
      Tr_logistic_status: "N",
    });
    res.status(200).json(TrLogistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get tr logistic by bulan
const getTrLogisticsBulan = async (req, res) => {
  try {
    let newdata = [];
    const TrLogistics = await Tr_logistic.find({
      Tr_logistic_domain: req.params.domain,
      Tr_logistic_tanggal: req.params.tanggal,
    });
    // for (let i = 0; i < Tr_logistic.length; i++) {
    //   // const element = array[i];
    //   // Tr_logistic[i].Tr_logistic_pic
    //     newdata.push(Tr_logistic[i]._id)

    // }
    const Pic1 = TrLogistics.map((pic) => pic.Tr_logistic_pic);
    const barang = TrLogistics.map((pic) => pic.Tr_logistic_detail);

    barang.forEach((arr) => {
      newdata = newdata.concat(arr);
    });
    let newData = {
      barang: { ...TrLogistics.map((pic) => pic.Tr_logistic_detail) },
    };
    // newdata.push(Pic1)
    res
      .status(200)
      .json(newdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getTrLogistic = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogistic = await Tr_logistic.findById(id);
    res.status(200).json(TrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createTrLogistic = async (req, res) => {
  try {
    const TrLogistic = await Tr_logistic.create(req.body);
    res.status(200).json(TrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create with gambar
const createTrLogisticGambar = async (req, res) => {
  try {
    const { Tr_logistic_gambar, ...dynamicFields } = req.body;
    if (!req.file || req.file.length === 0) {
      const newData = new Tr_logistic({
        ...dynamicFields,
        Tr_logistic_gambar: "NO-GAMBAR",
      });
      await newData.save();
    } else {
      const newData = new Tr_logistic({
        ...dynamicFields,
        Tr_logistic_gambar: req.file.filename,
      });
      await newData.save();
    }

    res.status(201).json({ message: "Gambar Sudah terupload" });
  } catch (error) {
    console.error("Gagal menyimpan gambar", error);
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik
const updateTrLogistic = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogistic = await Tr_logistic.findByIdAndUpdate(id, req.body);
    if (!TrLogistic) {
      return res.status(404).json({ message: "TrLogistic not found" });
    }

    const updatedTrLogistic = await Tr_logistic.findById(id);
    res.status(200).json(updatedTrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Updated Logistik status tiba
const updatedTrLogisticStatustiba = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogistic = await Tr_logistic.findByIdAndUpdate(id, {
      Tr_logistic_status_tiba: "Delivered",
    });

    if (!TrLogistic) {
      return res.status(404).json({ message: "TrLogistic tidak ada" });
    }
    const updatedTrLogistic = await Tr_logistic.findById(id);
    res.status(200).json(updatedTrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrLogisticGambar = async (req, res) => {
  try {
    const { id } = req.params;
    const TrLogistic = await Tr_logistic.findByIdAndUpdate(id, {
      Tr_logistic_gambar: req.file.filename,
    });

    if (!TrLogistic) {
      return res.status(404).json({ message: "TrLogistic tidak ada" });
    }
    const updatedTrLogistic = await Tr_logistic.findById(id);
    res.status(200).json(updatedTrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updated Logistik transaksi dibatalkan
const updatedTrLogisticTransaksiDibatalkan = async (req, res) => {
  try {
    const { id } = req.params;
    // const ubahtransaksidibatalkan =;
    const TrLogistic = await Tr_logistic.findByIdAndUpdate(id, {
      Tr_logistic_status: "N",
    });

    if (!TrLogistic) {
      return res.status(404).json({ message: "TrLogistic tidak ada" });
    }
    const updatedTrLogistic = await Tr_logistic.findById(id);
    res.status(200).json(updatedTrLogistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function deleteTrLogistic(req, res) {
  try {
    const { id } = req.params;

    const TrLogistic = await Tr_logistic.findByIdAndDelete(id);

    if (!TrLogistic) {
      return res.status(404).json({ message: "TrLogistic not found" });
    }

    res.status(200).json({ message: "TrLogistic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getTrLogistics,
  getTrLogisticsDibatalkan,
  getTrLogisticsBulan,
  getTrLogistic,
  createTrLogistic,
  createTrLogisticGambar,
  updateTrLogistic,
  updatedTrLogisticStatustiba,
  updateTrLogisticGambar,
  updatedTrLogisticTransaksiDibatalkan,
  deleteTrLogistic,
};
