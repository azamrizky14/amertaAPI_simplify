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

    const starts = parseCoord(mulai);
    const ends = parseCoord(berakhir);

    const url = `${OSRM_BASE_URL}/${starts};${ends}?overview=false`;
    const response = await axios.get(url);
    const final = response.data.routes[0];

    res.status(200).json({
      jarak: final.distance + " Meter",
      durasi: final.duration / 60 + " Menit",
      // final
    });
    // console.log(Data1);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Checklocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari dokumen berdasarkan ID
    const data = await DataDrafter.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // const resultfinal = data.map((odp) => ({
    //   NamaODP: odp.data_drafter_list_odp.data_drafter_list_odp_nama,
    // }));
    const result = data.data_drafter_list_odp.map((odp) => ({
      NAMA: odp.data_drafter_list_odp_nama,
      LOKASI: odp.data_drafter_list_odp_titik_koordinat,
      SLOT: odp.data_drafter_list_odp_slot,
    }));

    // Ambil hanya field `data_drafter_list_odp`
    // res.status(200).json(data.data_drafter_list_odp);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fungsi Biasa 
const getDistance = async (fromLat, fromLng, toLat, toLng) => {
  const url = `http://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false`;

  try {
    const response = await axios.get(url);
    const distance = response.data.routes[0].distance; // in meters
    return distance;
  } catch (err) {
    console.error("Error calculating distance:", err.message);
    return null;
  }
};

const hitungJarakKeODP = async (req, res) => {
 try {
    const { id } = req.params;
    const { lokasi_saya } = req.body;

    if (!lokasi_saya) {
      return res.status(400).json({ message: "lokasi_saya wajib diisi" });
    }

    const [myLat, myLng] = lokasi_saya.split(",").map(Number);

    // Ambil dokumen berdasarkan ID dari model DataDrafter
    const doc = await DataDrafter.findById(id);

    if (!doc || !Array.isArray(doc.data_drafter_list_odp)) {
      return res.status(404).json({ message: "Data ODP tidak ditemukan atau format tidak sesuai" });
    }

    const result = [];

    for (const odp of doc.data_drafter_list_odp) {
      const koordinat = odp.data_drafter_list_odp_titik_koordinat;

      if (!koordinat || typeof koordinat !== "string" || koordinat.trim() === "") continue;

      const [odpLat, odpLng] = koordinat.split(",").map(Number);
      const distance = await getDistance(myLat, myLng, odpLat, odpLng); // Pastikan ini fungsi async yg return jarak meter

      result.push({
        NAMA: odp.data_drafter_list_odp_nama,
        SLOT: odp.data_drafter_list_odp_slot,
        KOORDINAT: koordinat,
        JARAK_METER: distance
      });
    }

    // Urutkan dari jarak terdekat
    result.sort((a, b) => a.JARAK_METER - b.JARAK_METER);

    res.json(result);
  } catch (error) {
    console.error("Error in controller:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  Distance,
  DistanceWithDB,
  Checklocation,
  hitungJarakKeODP
};
