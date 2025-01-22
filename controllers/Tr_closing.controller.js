const Tr_closing = require("../models/Tr_closing.model");

// GET BY DOMAIN
const getTrclosing = async(req, res) => {
    try {
        const Trclosing = await Tr_closing.find({ Tr_closing_domain: req.params.domain, Tr_closing_status: "Y" });
        if (Trclosing.length > 0) {
            res.status(200).json(Trclosing);

        } else {
            res.status(404).json(Pesan = "DATA KOSONG");

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET TR CLOSING BY BULAN 
const getTrclosingByBulan = async(req, res) => {
    try {
        const Trclosing = await Tr_closing.find({ Tr_closing_domain: req.params.domain, Tr_closing_bulan: req.params.bulan });
        if (Trclosing.length > 0) {
            res.status(200).json(Trclosing)
        } else {
            res.status(404).json(Pesan = "DATA KOSONG")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// FIND ONE BY ID
const getTrclosingById = async(req, res) => {
    try {
        const { id } = req.params;
        const Trclosing = await Tr_closing.findById(id);
        res.status(200).json(Trclosing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE 
const createTrclosing = async(req, res) => {
    try {
        const Trclosing = await Tr_closing.create(req.body);
        res.status(200).json(Trclosing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CREATE wiht gambar 
const createTrclosingGambar = async(req, res) => {
    try {
        // const TrclosingBeforeNames = req.files['Tr_closing_before'].map(file => file.filename);
        // const TrclosingAfterNames = req.files['Tr_closing_after'][0].filename;
        const {...dynamicFields } = req.body;
        const { Tr_closing_before, Tr_closing_after } = req.files
        const newData = new Tr_closing({
            ...dynamicFields,
            Tr_closing_before: Tr_closing_before[0].filename,
            Tr_closing_after: Tr_closing_after[0].filename
        })
        await newData.save()
            // const TrclosingBeforeImages = 
        res.status(201).json({ message: 'Gambar sudah terupload' })
    } catch (error) {
        console.error('Gagal menyimpan data', error);
        res.status(500).json({ message: error.message })
    }
}

// Updated Logistik 
const updateTrclosing = async(req, res) => {
    try {
        const { id } = req.params;

        const Trclosing = await Tr_closing.findByIdAndUpdate(id, req.body);

        if (!Trclosing) {
            return res.status(404).json({ message: "Trclosing not found" });
        }

        const updatedTrclosing = await Tr_closing.findById(id);
        res.status(200).json(updatedTrclosing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatedTrclosingTahap = async(req, res) => {
    try {
        const { id } = req.params;
        const Trclosing = await Tr_closing.findByIdAndUpdate(id, {
            // item_stok:req.body.item_stok,
            // item_stok:req.body.item_stok,
            $push: { Tr_closing_tahap: req.body.Tr_closing_tahap }
        });

        if (!Trclosing) {
            return res.status(404).json({ message: "Trclosing tidak ada" });
        }
        const updatedMasterItemHistory = await Master_item.findById(id);
        res.status(200).json(updatedMasterItemHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getTrclosing,
    getTrclosingByBulan,
    getTrclosingById,
    createTrclosing,
    createTrclosingGambar,
    updateTrclosing,
    updatedTrclosingTahap
};