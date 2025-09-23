const AreaModel = require("../../models/AreaModel/Area.Model");

exports.getAreaByCompanyName = async (req, res) => {
  const { domain } = req.params;
  try {
    const area = await AreaModel.find({ CompanyName: domain });

    res.status(200).json(area);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch data area", error: err.message });
  }
};


exports.getAreaById = async (req, res) => {
  try {
    const area = await AreaModel.findById(req.params.id);
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createArea = async (req, res) => {
  try {
    const newarea = new AreaModel(req.body);
    const saved = await newarea.save();
    res.status(201).json({ message: "Area Created", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateArea = async (req, res) => {
  try {
    const updated = await AreaModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json({ message: "Area updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// exports.ValidateArea = async (req, res) => {
//   try {
//     const { areaName, CompanyName } = req.body;
//     const area = await AreaModel.findOne({ areaName, CompanyName });
//     if (area) {
//       return res.status(200).json({ exists: true, message: "Area name already exists" });
//     }
//     res.status(200).json({ exists: false, message: "Area name is available" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
