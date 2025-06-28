const { MikroNode } = require("mikronode-ng");

async function connectToMikrotik(host, user, password) {
  const device = MikroNode.getDevice(host);
  const connection = await device.connect(user, password);
  return connection;
}

// ✅ Fungsi cek identitas Mikrotik (hostname)
exports.getSystemIdentity = async (req, res) => {
  try {
    // Connect Db
    // const { mikrotikId } = req.params;
    // const config = await Mikrotik.findById(mikrotikId);
    // if (!config) return res.status(404).json({ message: "Mikrotik not found" });

    // const conn = await connectToMikrotik(config.host, config.user, config.password);
    // const chan = await conn.openChannel();

    // ----

    // Without Db
    const conn = await connectToMikrotik(
      "103.178.13.19:20222",
      "zaki",
      "16062025"
    );
    const chan = await conn.openChannel();
    const result = await chan.write("/system/identity/print");
    await chan.close();
    await conn.close();

    res.status(200).json({ identity: result.data[0]["name"] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Fungsi ping dari Mikrotik ke IP tertentu
exports.pingHost = async (req, res) => {
  try {

    // Connect DB 
    // const { mikrotikId } = req.params;
    // const { address } = req.body;

    // const config = await Mikrotik.findById(mikrotikId);
    // if (!config) return res.status(404).json({ message: "Mikrotik not found" });
    // ----

    const conn = await connectToMikrotik(
      "103.178.13.19:20222",
      "zaki",
      "16062025"
    );
    const chan = await conn.openChannel();

    const result = await chan.write("/ping", { address, count: 4 });

    await chan.close();
    await conn.close();

    res.status(200).json({ pingResult: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
