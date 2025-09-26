const ScheduleModel = require("../../models/ScheduleModel/Schedule.Model");

exports.getScheduleByCompanyNameWithValidFromAndTo = async (req, res) => {
  try {
    const { domain } = req.params;
    const { validFrom, validTo } = req.query;
    const schedules = await ScheduleModel.find({
      CompanyName: domain,
      validFrom: validFrom,
      validTo: validTo,
    })
      .populate({
        path: "ScheduleArea",
        select: "AreaName AreaId",
      })
      .populate({
        path: "ScheduleMember.ScheduleMemberId",
        model: "userInternal",
        select: "userName" // sesuaikan dengan field yang ingin diambil
      });
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await ScheduleModel.findById(req.params.id);
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan semua schedule yang memiliki ScheduleMember tertentu
exports.findScheduleByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { validFrom, validTo } = req.query;
    let filter = {
      "ScheduleMember.ScheduleMemberId": memberId,
    };
    if (validFrom && validTo) {
      filter.ValidFrom = { $lte: validFrom };
      filter.ValidTo = { $gte: validTo };
    } else if (validFrom) {
      filter.ValidFrom = { $lte: validFrom };
    } else if (validTo) {
      filter.ValidTo = { $gte: validTo };
    }
    const schedules = await ScheduleModel.find(filter).populate({
      path: "ScheduleArea",
      select: "AreaName AreaId",
    });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const newschedule = new ScheduleModel(req.body);
    const saved = await newschedule.save();
    res.status(201).json({ message: "Schedule Created", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const updated = await ScheduleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Schedule updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Schedule PREFIX
exports.getTicketPrefix = async (req, res) => {
  try {
    const { type, date } = req.params;
    const { domain } = req.query;

    const newDate = date.replace(/-/g, "");
    const prefix = `${type}${newDate}`;

    let filterData = {
      ScheduleId: { $regex: `^${prefix}` },
    };

    if (domain !== "all") {
      filterData.CompanyName = domain;
    }

    const data = await ScheduleModel.find(filterData);
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}001` });
    }

    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.ScheduleId.substring(prefix.length) || "0"
      );
      const maxNumber = parseInt(maxId.substring(prefix.length) || "0");
      return currentNumber > maxNumber ? currentItem.ScheduleId : maxId;
    }, "");

    const latestNumber = parseInt(latestId.substring(prefix.length) || "0");
    const nextNumber = (latestNumber + 1).toString().padStart(3, "0");
    const nextId = `${prefix}${nextNumber}`;
    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
