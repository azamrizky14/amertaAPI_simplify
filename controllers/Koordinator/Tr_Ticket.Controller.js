const TrTicket = require("../../models/Koordinator/Tr_Ticket.Model");

// GET BY DOMAIN
const getTrTicket = async (req, res) => {
  try {
    const { domain, deleted } = req.params;
    const filter = { companyName: domain };
    if (deleted) filter.Tr_ticket_status = deleted;
    const MasterTrTicket = await TrTicket.find(filter);
    res.status(200).json(MasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BY DIVISI
const getTrTicketByKategori = async (req, res) => {
  try {
    const { domain, kategori } = req.params;
    const { deleted, startDate, endDate } = req.query;


    // Base filter
    const matchStage = {
      companyName: domain,
      Tr_ticket_kategori: kategori,
    };

    if (deleted) {
      matchStage.Tr_ticket_status = deleted;
    }

    // Filter berdasarkan Tr_ticket_created
    if (startDate || endDate) {
      matchStage.Tr_ticket_created = {};
      if (startDate) {
        matchStage.Tr_ticket_created.$gte = startDate; // YYYY-MM-DD string
      }
      if (endDate) {
        matchStage.Tr_ticket_created.$lte = endDate;   // YYYY-MM-DD string
      }
    }

    const pipeline = [
      { $match: matchStage },
      // Bisa tambah $sort, $lookup, atau stage lain di sini
    ];

    const MasterTrTicket = await TrTicket.aggregate(pipeline);

    res.status(200).json(MasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTrTicketByTrUpdatedHarian = async (req, res) => {
  try {
    const { domain, type, tgl, deleted } = req.params;

    // Validasi awal
    if (!domain || !tgl) {
      return res
        .status(400)
        .json({ message: "Parameter Tidak ada : domain, or name" });
    }

    // Dapatkan company code dari helper

    const filter = {
      companyName: domain,
      Tr_ticket_kategori: type,
      Tr_ticket_completition_history: {
        $elemMatch: {
          Tr_ticket_completition_tanggal: tgl,
        },
      },
    };

    if (deleted) {
      filter.Tr_ticket_status = deleted;
    }

    // Eksekusi query
    const MasterTrTicket = await TrTicket.find(filter).lean();
    const FilteredMasterTrTicket = MasterTrTicket.flatMap((ticket) =>
      ticket.Tr_ticket_completition_history.filter(
        (history) => history.Tr_ticket_completition_tanggal === tgl
      ).map((history) => ({
        // data dari parent
        Tr_ticket_id: ticket.Tr_ticket_id,
        Tr_ticket_status: ticket.Tr_ticket_status,
        Tr_ticket_name: ticket.Tr_ticket_name,
        Tr_ticket_created: ticket.Tr_ticket_created,
        Tr_ticket_data_pelanggan: ticket.Tr_ticket_data_pelanggan,
        _id: ticket._id,
        // data dari history
        ...history,
      }))
    );

    res.status(200).json(FilteredMasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrTicketByTeknisi = async (req, res) => {
  try {
    const { domain, name, deleted } = req.params;

    // Validasi awal
    if (!domain || !name) {
      return res
        .status(400)
        .json({ message: "Parameter Tidak ada : domain, or name" });
    }

    // Dapatkan company code dari helper

    const filter = {
      companyName: domain,
      Tr_ticket_completition_history: {
        $elemMatch: {
          Tr_ticket_completition_pic: {
            $elemMatch: {
              Tr_ticket_completition_pic_name: name,
            },
          },
        },
      },
    };

    if (deleted) {
      filter.Tr_ticket_status = deleted;
    }

    // Eksekusi query
    const MasterTrTicket = await TrTicket.find(filter).lean();
    res.status(200).json(MasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FIND ONE BY ID
const getTrTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const MasterTrTicket = await TrTicket.findById(filter);
    res.status(200).json(MasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET BON PREFIX
const getTicketPrefix = async (req, res) => {
  try {
    const { type, date } = req.params;
    const { domain } = req.query;

    const newDate = date.replace(/-/g, "");
    const prefix = `${type}-${newDate}`;

    let filterData = {
      Tr_ticket_id: { $regex: `^${prefix}` },
    }

    if (domain !== 'all') {
      filterData.companyName = domain
    }

    const data = await TrTicket.find(filterData);
    if (data.length === 0) {
      return res.json({ nextId: `${prefix}-001` });
    }
    const latestId = data.reduce((maxId, currentItem) => {
      const currentNumber = parseInt(
        currentItem.Tr_ticket_id.split("-").pop() || "0"
      );
      const maxNumber = parseInt(maxId.split("-").pop() || "0");
      return currentNumber > maxNumber ? currentItem.Tr_ticket_id : maxId;
    }, "");
    const latestNumber = parseInt(latestId.split("-").pop() || "0");
    const nextNumber = (latestNumber + 1).toString().padStart(3, "0");
    const nextId = `${prefix}-${nextNumber}`;
    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE
const createTrTicket = async (req, res) => {
  try {
    const MasterTrTicket = await TrTicket.create(req.body);
    res.status(200).json(MasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateTrTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const MasterTrTicket = await TrTicket.findByIdAndUpdate(id, req.body);

    if (!MasterTrTicket) {
      return res.status(404).json({ message: "MasterItem not found" });
    }

    const updatedMasterTrTicket = await TrTicket.findById(id);
    res.status(200).json(updatedMasterTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrTicketHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const newHistory = req.body.Tr_ticket_completition_history;
    const newUpdate = req.body.Tr_ticket_updated;

    const updatedTrTicket = await TrTicket.findByIdAndUpdate(
      id,
      {
        $push: {
          Tr_ticket_completition_history: newHistory,
          Tr_ticket_updated: newUpdate,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTrTicket) {
      return res.status(404).json({ message: "TrTicket not found" });
    }

    res.status(200).json(updatedTrTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrTicket,
  getTrTicketByKategori,
  getTrTicketByTrUpdatedHarian,
  getTrTicketByTeknisi,
  getTrTicketById,
  getTicketPrefix,
  createTrTicket,
  updateTrTicket,
  updateTrTicketHistory,
};
