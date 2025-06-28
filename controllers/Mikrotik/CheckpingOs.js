const  RouterOSClient  = require('routeros-client').RouterOSClient;


const connectToMikrotik = async (host, user, password) => {
  const client = new RouterOSClient({ host, user, password });
  await client.connect();
  return client;
};

exports.createPppoeSecret = async (req, res) => {
  try {
    const { mikrotikId, name, password } = req.body;
    const config = await Mikrotik.findById(mikrotikId);
    if (!config) return res.status(404).json({ message: "Mikrotik not found" });

    const client = await connectToMikrotik(config.host, config.user, config.password);

    const pppSecret = {
      name,
      password,
      service: "pppoe",
      profile: "default"
    };

    await client.menu('/ppp/secret').add(pppSecret);

    res.status(200).json({ message: "PPPoE secret created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};