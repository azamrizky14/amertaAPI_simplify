const Master_pengguna = require("../models/Master_pengguna.model");



// GET DATA by status
// const getMasterpengguna = async(req, res) => {
//     try {
//         const Masterpengguna = await Master_pengguna.find({ master_pengguna_domain: req.params.domain, master_pengguna_status: req.params.status });
//         res.status(200).json(Masterpengguna);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 
const getMasterpengguna = async (req, res) => {
    try {
        const Masterpengguna = await Master_pengguna.find({ master_pengguna_domain: req.params.domain, master_pengguna_status: "Y" });
        res.status(200).json(Masterpengguna);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FIND ONE BY ID
const getMasterpenggunaid = async(req, res) => {
    try {
        const { id } = req.params;
        const Masterpengguna = await Master_pengguna.findById(id);
        res.status(200).json(Masterpengguna);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// CREATE 
const createMasterpengguna = async(req, res) => {
    try {
        const Masterpengguna = await Master_pengguna.create(req.body);
        res.status(200).json(Masterpengguna);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Updated MasterItem 
const updateMasterpengguna = async(req, res) => {
    try {
        const { id } = req.params;

        const Masterpengguna = await Master_pengguna.findByIdAndUpdate(id, req.body);

        if (!Masterpengguna) {
            return res.status(404).json({ message: "MasterItem not found" });
        }

        const updatedMasterpengguna = await Master_pengguna.findById(id);
        res.status(200).json(updatedMasterpengguna);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMasterpengguna,
    getMasterpenggunaid,
    createMasterpengguna,
    updateMasterpengguna
};