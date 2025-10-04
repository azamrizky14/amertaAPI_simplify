const express = require("express");
const { generatePrefix } = require("../../Utils/prefixHelper");
const TrTransaction = require("../../models/Keuangan/TrTransaction.Model");

const router = express.Router();

/**
 * GET /api/transaksi/next?fieldName=reference&prefix=INV&date=2025-10-03
 */
router.get("/next", async (req, res) => {
  try {
    const { fieldName, prefix, date } = req.query;

    if (!fieldName || !prefix || !date) {
      return res
        .status(400)
        .json({ error: "fieldName, prefix, dan date wajib diisi" });
    }

    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ error: "Format tanggal tidak valid" });
    }

    // langsung pakai model yg diimport
    const newPrefix = await generatePrefix(TrTransaction, fieldName, prefix, formattedDate);
    res.json({ prefix: newPrefix });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal generate prefix" });
  }
});

module.exports = router;
