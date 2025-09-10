const DataTipe = require("../../models/Umum/DataTipe.Models");


const { styleDomain } = require("../../utils/hierarchyAndDomain");

// GET BY DOMAIN
const getDataTipe = async (req, res) => {
    try {
        const { domain, deleted } = req.params;
        const newDomain = await styleDomain(domain);
        const filter = { companyCode: newDomain };
        if (deleted) filter.data_tipe_status = deleted;
        const MasterDataTipe = await DataTipe.find(filter);
        res.status(200).json(MasterDataTipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// FIND ONE BY ID
const getDataTipeByFilter = async (req, res) => {
    try {
        const { nama, domain } = req.query;
        const filter = {}
        if (nama) filter.data_tipe_nama = nama;
        if (domain !== 'all') filter.companyName = domain;
        const MasterDataTipe = await DataTipe.findOne(filter);
        res.status(200).json(MasterDataTipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// FIND ONE BY ID
const getDataTipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const filter = { _id: id }
        const MasterDataTipe = await DataTipe.findById(filter);
        res.status(200).json(MasterDataTipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CREATE 
const createDataTipe = async (req, res) => {
    try {
        const MasterDataTipe = await DataTipe.create(req.body);
        res.status(200).json(MasterDataTipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Updated MasterItem 
const updateDataTipe = async (req, res) => {
    try {
        const { id } = req.params;

        const MasterDataTipe = await DataTipe.findByIdAndUpdate(id, req.body);

        if (!MasterDataTipe) {
            return res.status(404).json({ message: "DataTipe not found" });
        }

        const updatedMasterDataTipe = await DataTipe.findById(id);
        res.status(200).json(updatedMasterDataTipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ----------

module.exports = {
    getDataTipe,
    getDataTipeById,
    createDataTipe,
    getDataTipeByFilter,
    updateDataTipe
};
