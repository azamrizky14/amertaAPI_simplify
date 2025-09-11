const GradingModel = require("../../models/Grading/Grading.Model");

exports.getGradingByCompanyName = async (req, res) => {
  const { domain } = req.params;
  try {
    const grading = await GradingModel.find({ CompanyName: domain })
    .populate({
        path:"userId",
        model:"userInternal",
        select:"userName email userRole"
    }).exec()
    res.status(200).json(grading);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch data grading", error: err.message });
  }
};

exports.getGradingById = async (req, res) => {
  try {
    const grading = await GradingModel.findById(req.params.id);
    res.status(200).json(grading);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGrading = async (req, res) => {
  try {
    const newgrading = new GradingModel(req.body);
    const saved = await newgrading.save();
    res.status(201).json({ message: "Grading Created", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGrading = async (req, res) => {
  try {
    const updated = await GradingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Grading updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
