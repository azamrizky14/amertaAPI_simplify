const Tr_qc = require("../models/Tr_qc.model");

// GET BY DOMAIN
const getTrQc = async (req, res) => {
  try {
    const TrQc = await Tr_qc.find({ Tr_qc_domain: req.params.domain, Tr_qc_status: "Y" });
    if (TrQc.length > 0) {
      res.status(200).json(TrQc);

    } else {
      res.status(404).json(Pesan = "DATA KOSONG");

    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// FIND ONE BY ID
const getTrQcById = async (req, res) => {
  try {
    const { id } = req.params;
    const TrQc = await Tr_qc.findById(id);
    res.status(200).json(TrQc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE 
const createTrQc = async (req, res) => {
  try {
    const TrQc = await Tr_qc.create(req.body);
    res.status(200).json(TrQc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE wiht gambar 
const createTrQcGambar = async (req, res) => {
  try {
    // const TrqcBeforeNames = req.files['Tr_qc_before'].map(file => file.filename);
    // const TrqcAfterNames = req.files['Tr_qc_after'][0].filename;
    const { ...dynamicFields } = req.body;
    const { Tr_qc_before, Tr_qc_after } = req.files
    const newData = new Tr_qc
      ({
        ...dynamicFields,
        Tr_qc_before: Tr_qc_before[0].filename,
        Tr_qc_after: Tr_qc_after[0].filename
      })
    await newData.save()
    // const TrqcBeforeImages = 
    res.status(201).json({ message: 'Gambar sudah terupload' })
  } catch (error) {
    console.error('Gagal menyimpan data', error);
    res.status(500).json({ message: error.message })
  }
}

// Updated Logistik 
const updateTrQc = async (req, res) => {
  try {
    const { id } = req.params;

    const TrQc = await Tr_qc.findByIdAndUpdate(id, req.body);

    if (!TrQc) {
      return res.status(404).json({ message: "TrQc not found" });
    }

    const updatedTrQc = await Tr_qc.findById(id);
    res.status(200).json(updatedTrQc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatedTrQcTahap = async (req, res) => {
  try {
    const { id } = req.params;
    const TrQc = await Tr_qc.findByIdAndUpdate(id, {
      // item_stok:req.body.item_stok,
      // item_stok:req.body.item_stok,
      $push: { Tr_qc_tahap: req.body.Tr_qc_tahap }
    }
    );

    if (!TrQc) {
      return res.status(404).json({ message: "TrQc tidak ada" });
    }
    const updatedMasterItemHistory = await Master_item.findById(id);
    res.status(200).json(updatedMasterItemHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





module.exports = {
  getTrQc,
  getTrQcById,
  createTrQc,
  createTrQcGambar,
  updateTrQc,
  updatedTrQcTahap
};
