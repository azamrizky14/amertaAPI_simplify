const Tr_task = require("../models/Tr_task.model");

// GET BY DOMAIN
const getTrtask = async(req, res) => {
    try {
        const Trtask = await Tr_task.find({ Tr_task_domain: req.params.domain, Tr_task_status: "Y" });
        if (Trtask.length > 0) {
            res.status(200).json(Trtask);

        } else {
            res.status(404).json(Pesan = "DATA KOSONG");

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 
// FIND ONE BY ID
const getTrtaskById = async(req, res) => {
    try {
        const { id } = req.params;
        const Trtask = await Tr_task.findById(id);
        res.status(200).json(Trtask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE 
const createTrtask = async(req, res) => {
    try {
        const Trtask = await Tr_task.create(req.body);
        res.status(200).json(Trtask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CREATE wiht gambar 
const createTrtaskGambar = async(req, res) => {
    try {
        // const TrtaskBeforeNames = req.files['Tr_task_before'].map(file => file.filename);
        // const TrtaskAfterNames = req.files['Tr_task_after'][0].filename;
        const {...dynamicFields } = req.body;
        const { Tr_task_before, Tr_task_after } = req.files
        const newData = new Tr_task({
            ...dynamicFields,
            Tr_task_before: Tr_task_before[0].filename,
            Tr_task_after: Tr_task_after[0].filename
        })
        await newData.save()
            // const TrtaskBeforeImages = 
        res.status(201).json({ message: 'Gambar sudah terupload' })
    } catch (error) {
        console.error('Gagal menyimpan data', error);
        res.status(500).json({ message: error.message })
    }
}

// Updated Logistik 
const updateTrtask = async(req, res) => {
    try {
        const { id } = req.params;

        const Trtask = await Tr_task.findByIdAndUpdate(id, req.body);

        if (!Trtask) {
            return res.status(404).json({ message: "Trtask not found" });
        }

        const updatedTrtask = await Tr_task.findById(id);
        res.status(200).json(updatedTrtask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatedTrtaskTahap = async(req, res) => {
    try {
        const { id } = req.params;
        const Trtask = await Tr_task.findByIdAndUpdate(id, {
            // item_stok:req.body.item_stok,
            // item_stok:req.body.item_stok,
            $push: { Tr_task_tahap: req.body.Tr_task_tahap }
        });

        if (!Trtask) {
            return res.status(404).json({ message: "Trtask tidak ada" });
        }
        const updatedMasterItemHistory = await Master_item.findById(id);
        res.status(200).json(updatedMasterItemHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    getTrtask,
    getTrtaskById,
    createTrtask,
    createTrtaskGambar,
    updateTrtask,
    updatedTrtaskTahap
};