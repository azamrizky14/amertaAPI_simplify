  const Location = require("../models/locationModels.js");
  // GET BY DOMAIN
  const getMasterLocation = async (req, res) => {
    try {
      const { domain, deleted } = req.params;

      // Create a filter object dynamicallysz
      const filter = { companyName: domain };  

      // Add optional filters if provided
      if (deleted) filter.lokasi_deleted = deleted;

      const MasterLocation = await Location.find(filter).lean();

      // Remove `lokasi_detail` from the response
      const filteredData = MasterLocation.map((location) => {
        const { lokasi_detail, ...rest } = location; // Destructure and exclude `lokasi_detail`
        return rest;
      });

      res.status(200).json(filteredData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // FIND ONE BY ID
  const getMasterLocationId = async (req, res) => {
    try {
      const { id } = req.params;
      const filter = {_id: id}

      const MasterLocation = await Location.findById(filter);
      // const MasterLocation = await Location.findById(filter).lean();

      // // Remove `lokasi_detail` from the response
      // const filteredData = MasterLocation.map((location) => {
      //   const { lokasi_detail, ...rest } = location; // Destructure and exclude `lokasi_detail`
      //   return rest;
      // });

      // const { lokasi_detail, ...rest } = MasterLocation;

      // const filteredData = rest;

      // res.status(200).json(filteredData);
      res.status(200).json(MasterLocation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } 
  };

  const getLocationByTipe = async (req, res) => {
    try {
      const { company, jenis, alamat } = req.params;
  
      // Decode the alamat parameter
      const decodedAlamat = decodeURIComponent(alamat);
  
      // Build the filter object
      const filter = {
        lokasi_tipe: jenis, // Match lokasi_tipe with the provided 'jenis'
      };

      if (company) filter.companyName = company
  
      // Add additional filters based on 'jenis' and 'alamat'
      if (decodedAlamat && jenis === 'ruang') {
        filter['lokasi_alamat.lokasi_alamat_gudang'] = new RegExp(`^${decodedAlamat}$`, 'i'); // Case-insensitive match
      } else if (decodedAlamat && jenis === 'rak') {
        filter['lokasi_alamat.lokasi_alamat_ruang'] = new RegExp(`^${decodedAlamat}$`, 'i'); // Case-insensitive match
      }
  
      // Find documents based on the filter
      const MasterLocation = await Location.find(filter).lean();
  
      // Remove `lokasi_detail` from the response
      const data = MasterLocation.map((location) => {
        const { lokasi_detail, ...rest } = location; // Destructure and exclude `lokasi_detail`
        return rest;
      });
  
      // Respond with the data
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Error fetching lokasi data:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching lokasi data.',
      });
    }
  };
  

  // CREATE 
  const createMasterLocation = async (req, res) => {
    try {
      const MasterLocation = await Location.create(req.body);
      res.status(200).json(MasterLocation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // UPDATE
  const updateMasterLocation = async (req, res) => {
    try {
      const { id } = req.params;
      const { __v, ...updatedData } = req.body;

      // Use __v for optimistic concurrency control
      const updatedLocation = await Location.findOneAndUpdate(
        { _id: id, __v }, // Match both the ID and version
        { ...updatedData },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validations are run
        }
      );

      if (!updatedLocation) {
        return res.status(409).json({ message: "Version conflict or location not found" });
      }

      res.status(200).json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  module.exports = {
    getMasterLocation,
    getMasterLocationId,
    createMasterLocation,
    updateMasterLocation,
    getLocationByTipe
  };
