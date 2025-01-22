const Tr_pembayaran = require("../models/Tr_pembayaran.model");

// GET BY DOMAIN
const getTrpembayaran = async(req, res) => {
    try {
        const Trpembayaran = await Tr_pembayaran.find({ Tr_pembayaran_domain: req.params.domain, Tr_pembayaran_status: "Y" });
        if (Trpembayaran.length > 0) {
            res.status(200).json(Trpembayaran);

        } else {
            res.status(404).json(Pesan = "DATA KOSONG");

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PEMBAYARAN BY STATUS BAYAR 
const getTrpembayaranbystatusbayar = async(req, res) => {
    try {
        const Trpembayaran = await Tr_pembayaran.find({ Tr_pembayaran_domain: req.params.domain, Tr_pembayaran_status_bayar: req.params.status });
        if (Trpembayaran.length > 0) {
            res.status(200).json(Tr_pembayaran)
        } else {
            res.status(404).json(Pesan = "DATA KOSONG")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// FIND ONE BY ID
const getTrpembayaranById = async(req, res) => {
    try {
        const { id } = req.params;
        const Trpembayaran = await Tr_pembayaran.findById(id);
        res.status(200).json(Trpembayaran);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE 
const createTrpembayaran = async(req, res) => {
    try {
        const Trpembayaran = await Tr_pembayaran.create(req.body);
        res.status(200).json(Trpembayaran);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CREATE wiht gambar 
const createTrpembayaranGambar = async(req, res) => {
    try {
        // const TrpembayaranBeforeNames = req.files['Tr_pembayaran_before'].map(file => file.filename);
        // const TrpembayaranAfterNames = req.files['Tr_pembayaran_after'][0].filename;
        const {...dynamicFields } = req.body;
        const { Tr_pembayaran_before, Tr_pembayaran_after } = req.files
        const newData = new Tr_pembayaran({
            ...dynamicFields,
            Tr_pembayaran_before: Tr_pembayaran_before[0].filename,
            Tr_pembayaran_after: Tr_pembayaran_after[0].filename
        })
        await newData.save()
            // const TrpembayaranBeforeImages = 
        res.status(201).json({ message: 'Gambar sudah terupload' })
    } catch (error) {
        console.error('Gagal menyimpan data', error);
        res.status(500).json({ message: error.message })
    }
}

// Updated Logistik 
const updateTrpembayaran = async(req, res) => {
    try {
        const { id } = req.params;

        const Trpembayaran = await Tr_pembayaran.findByIdAndUpdate(id, req.body);

        if (!Trpembayaran) {
            return res.status(404).json({ message: "Trpembayaran not found" });
        }

        const updatedTrpembayaran = await Tr_pembayaran.findById(id);
        res.status(200).json(updatedTrpembayaran);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatedTrpembayaranTahap = async(req, res) => {
    try {
        const { id } = req.params;
        const Trpembayaran = await Tr_pembayaran.findByIdAndUpdate(id, {
            // item_stok:req.body.item_stok,
            // item_stok:req.body.item_stok,
            $push: { Tr_pembayaran_tahap: req.body.Tr_pembayaran_tahap }
        });

        if (!Trpembayaran) {
            return res.status(404).json({ message: "Trpembayaran tidak ada" });
        }
        const updatedMasterItemHistory = await Master_item.findById(id);
        res.status(200).json(updatedMasterItemHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    getTrpembayaran,
    getTrpembayaranbystatusbayar,
    getTrpembayaranById,
    createTrpembayaran,
    createTrpembayaranGambar,
    updateTrpembayaran,
    updatedTrpembayaranTahap
};