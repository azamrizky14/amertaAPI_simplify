const TrRab = require("../../models/Logistik/Tr_Rab.Model");


const { findByHierarchyAndDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getTrRab = async (req, res) => {
    try {
        const { domain, hierarchy, deleted } = req.params;
        const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2)
        const filter = { companyCode: newDomain };
        if (deleted) filter.Tr_rab_status = deleted;
        const MasterTrRab = await TrRab.find(filter);
        res.status(200).json(MasterTrRab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET BY KATEGORI 
const getTrRabByKategori = async (req, res) => {
    try {
        const { domain, hierarchy, kategori, deleted } = req.params;
        const newDomain = await findByHierarchyAndDomain(hierarchy, domain, 2)
        const filter = { companyCode: newDomain, Tr_rab_kategori: kategori };
        if (deleted) filter.Tr_rab_status = deleted;
        const MasterTrRab = await TrRab.find(filter);
        res.status(200).json(MasterTrRab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// FIND ONE BY ID
const getTrRabById = async (req, res) => {
    try {
        const { id } = req.params;
        const filter = { _id: id }
        const MasterTrRab = await TrRab.findById(filter);
        res.status(200).json(MasterTrRab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE 
const createTrRab = async (req, res) => {
    try {
        const MasterTrRab = await TrRab.create(req.body);
        res.status(200).json(MasterTrRab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update 
const updateTrRab = async (req, res) => {
    try {
        const { id } = req.params;

        const MasterTrRab = await TrRab.findByIdAndUpdate(id, req.body);

        if (!MasterTrRab) {
            return res.status(404).json({ message: "TrRab not found" });
        }

        const updatedMasterTrRab = await TrRab.findById(id);
        res.status(200).json(updatedMasterTrRab);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getTrRab,
    getTrRabByKategori,
    getTrRabById,
    createTrRab,
    updateTrRab,
};
