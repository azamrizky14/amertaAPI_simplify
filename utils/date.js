// utils/date.js

/**
 * Hitung durasi antara dua tanggal dalam format "x hari" atau "x jam".
 * @param {string|Date} date1 - tanggal awal (string atau Date)
 * @param {string|Date} date2 - tanggal akhir (string atau Date)
 * @returns {string} - durasi (contoh: "3 hari" atau "5 jam")
 */
function getDuration(date1, date2) {
  if (!date1 || !date2) {
    return "-";
  }

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Kalau salah satu bukan tanggal valid
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return "-";
  }

  const diffMs = d2 - d1;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays >= 1) {
    return `${diffDays} hari`;
  }
  return `${diffHours} jam`;
}

module.exports = { getDuration };
