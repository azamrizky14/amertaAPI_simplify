// const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";
const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";
const axios = require("axios");
const DataDrafter = require("../../models/Umum/DataDrafter.Models");
const Distance = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Masukkan parameter ?start=lng,lat&end=lng,lat" });
  }

  try {
    const url = `${OSRM_BASE_URL}/${start};${end}?overview=false`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: "Rute tidak ditemukan" });
    }

    const route = data.routes[0];

    res.json({
      distance_meters: route.distance,
      duration_seconds: route.duration,
      duration_minutes: (route.duration / 60).toFixed(2),
    });
  } catch (error) {
    console.error("Error OSRM:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan saat mengambil data OSRM" });
    console.log(url);
  }
};

function parseCoord(coordStr) {
  const [latStr, lngStr] = coordStr.trim().split(" ");
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  return `${lng},${lat}`; // balik jadi lng,lat
}
const DistanceWithDB = async (req, res) => {
  try {
    const { fromid, toid } = req.params;
    const filter1 = { _id: fromid };
    const filter2 = { _id: toid };

    const Data1 = await DataDrafter.findById(filter1);
    const Data2 = await DataDrafter.findById(filter2);
    const mulai = Data1.data_drafter_titik_koordinat;
    const berakhir = Data2.data_drafter_titik_koordinat;

    const starts = parseCoord(mulai)
    const ends = parseCoord(berakhir)

    const url = `${OSRM_BASE_URL}/${starts};${ends}?overview=false`;
    const response = await axios.get(url);
    const final = response.data.routes[0];

    res.status(200).json({
        jarak: final.distance + " Meter",
        durasi: final.duration /60 + " Menit"
        // final
    });
    // console.log(Data1);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  Distance,
  DistanceWithDB,
};
