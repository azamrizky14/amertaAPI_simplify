const AreaModel = require("../../models/AreaModel/Area.Model");
const turf = require("@turf/turf");

exports.getAreaByCompanyName = async (req, res) => {
  const { domain } = req.params;
  const { list } = req.query;

  try {
    let projection = {};

    if (list) {
      // pecah list jadi array field
      const fields = list.split("-");
      fields.forEach((field) => {
        if (field.trim()) {
          projection[field.trim()] = 1; // pilih field sesuai schema
        }
      });
    }

    // console.log("ini list:", list);
    // console.log("projection:", projection);

    const area = await AreaModel.find(
      { CompanyName: domain },
      Object.keys(projection).length > 0 ? projection : undefined
    ).select("-__v"); // __v dihapus biar lebih bersih

    res.status(200).json(area);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch data area",
      error: err.message,
    });
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
    const updated = await AreaModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Area updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.ValidateArea = async (req, res) => {
  try {
    const { longitude, latitude, areaId, CompanyName } = req.body;
    const areacoverage = await AreaModel.findOne({ AreaId: areaId, CompanyName: CompanyName });
    if (!areacoverage) {
      return res.status(404).json({ message: "Area not found" });
    }
    const point = turf.point([longitude, latitude]);
    // Ubah AreaArray menjadi array koordinat [lng, lat]
    const polygonCoords = areacoverage.AreaArray.map(coord => [coord.lng, coord.lat]);
    const polygon = turf.polygon([polygonCoords]);
    const inside = turf.booleanPointInPolygon(point, polygon);

    if (inside) {
      res.status(200).json({ message: "Point is inside the area", inside: true });
    } else {
      res.status(200).json({ message: "Point is outside the area", inside: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
