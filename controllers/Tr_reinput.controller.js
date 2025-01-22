const Tr_reinput = require("../models/Tr_reinput.model");

// GET BY DOMAIN
const getTrreinput = async(req, res) => {
    try {
        const Trreinput = await Tr_reinput.find({ Tr_reinput_domain: req.params.domain, Tr_reinput_status: "Y" });
        if (Trreinput.length > 0) {
            res.status(200).json(Trreinput);

        } else {
            res.status(404).json(Pesan = "DATA KOSONG");

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// FIND ONE BY ID
const getTrreinputById = async(req, res) => {
    try {
        const { id } = req.params;
        const Trreinput = await Tr_reinput.findById(id);
        res.status(200).json(Trreinput);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE 
const createTrreinput = async(req, res) => {
    try {
        const Trreinput = await Tr_reinput.create(req.body);
        res.status(200).json(Trreinput);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CREATE wiht gambar 
const createTrreinputGambar = async(req, res) => {
    try {
        // const TrreinputBeforeNames = req.files['Tr_reinput_before'].map(file => file.filename);
        // const TrreinputAfterNames = req.files['Tr_reinput_after'][0].filename;
        const {...dynamicFields } = req.body;
        const { Tr_reinput_before, Tr_reinput_after } = req.files
        const newData = new Tr_reinput({
            ...dynamicFields,
            Tr_reinput_before: Tr_reinput_before[0].filename,
            Tr_reinput_after: Tr_reinput_after[0].filename
        })
        await newData.save()
            // const TrreinputBeforeImages = 
        res.status(201).json({ message: 'Gambar sudah terupload' })
    } catch (error) {
        console.error('Gagal menyimpan data', error);
        res.status(500).json({ message: error.message })
    }
}

// Updated Logistik 
const updateTrreinput = async(req, res) => {
    try {
        const { id } = req.params;

        const Trreinput = await Tr_reinput.findByIdAndUpdate(id, req.body);

        if (!Trreinput) {
            return res.status(404).json({ message: "Trreinput not found" });
        }

        const updatedTrreinput = await Tr_reinput.findById(id);
        res.status(200).json(updatedTrreinput);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatedTrreinputTahap = async(req, res) => {
    try {
        const { id } = req.params;
        const Trreinput = await Tr_reinput.findByIdAndUpdate(id, {
            // item_stok:req.body.item_stok,
            // item_stok:req.body.item_stok,
            $push: { Tr_reinput_tahap: req.body.Tr_reinput_tahap }
        });

        if (!Trreinput) {
            return res.status(404).json({ message: "Trreinput tidak ada" });
        }
        const updatedMasterItemHistory = await Master_item.findById(id);
        res.status(200).json(updatedMasterItemHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    getTrreinput,
    getTrreinputById,
    createTrreinput,
    createTrreinputGambar,
    updateTrreinput,
    updatedTrreinputTahap
};