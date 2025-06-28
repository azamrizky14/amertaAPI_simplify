const { RouterOSClient } = require("node-routeros").RouterOSAPI;
const DataPelanggan = require("../../models/Umum/DataPelanggan.Models");

const ConnectMikrotikByid = async (req, res) => {
  const { id } = req.params;

  try {
    const config = await DataPelanggan.findById(id);
    // if (!config) {
    //   return res.status(404).json({ message: "Konfigurasi gagal" });
    // }

    const client = new RouterOSClient({
      // host: config.data_pelanggan_mikrotik_access.data_pelanggan_mikrotik_access_host,
      // user: config.data_pelanggan_mikrotik_access.data_pelanggan_mikrotik_access_username,
      // password: config.data_pelanggan_mikrotik_access.data_pelanggan_mikrotik_access_password,
      // port: config.data_pelanggan_mikrotik_access.data_pelanggan_mikrotik_access_port,


      host: "103.178.13.50",
      user: "api-test",
      password: "apipassword123"

//       const host = "103.178.13.50";
//       const user = "api-test";
// const password = "apipassword123";
// const port = 1121;
    });

    await client.connect();

    const ipAddress = await client.menu("/ip/address").getAll();

    client.close();

    res.status(200).json({ message: "Berhasil konek" }, ipAddress);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal konek ke MikroTik", error: err.message });
  }
};

module.exports = {
  ConnectMikrotikByid
};
