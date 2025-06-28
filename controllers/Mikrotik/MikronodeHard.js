const { getConnection } = require("mikronode-ng");

// 🔒 Hardcoded Mikrotik credentials
const MIKROTIK_CONFIG = {
  host: "103.178.13.137:2123",
  user: "zaki",
  password: "16062025",
};

const host = "103.178.13.50";
const user = "api-test";
const password = "apipassword123";
const port = 1121;


// Fungsi untuk koneksi ke Mikrotik
function connectToRouter() {
  const conn =  getConnection(host, user, password, { port: port });
  return conn.getConnectPromise();
}

exports.testConnection = async (req, res) => {
  try {
    const conn = await connectToRouter();
    res.json({ status: "Connected successfully to Mikrotik!" });
    await conn.close();
  } catch (error) {
    res.status(500).json({ error: "Failed to connect", detail: error.message });
  }
};
exports.getSystemIdentity = async (req, res) => {
  try {
    const conn = await connectToRouter();
    const result = await conn.getCommandPromise("/system/resource/print");
    res.json(result[0]);
    conn.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ping IP Address
exports.pingAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const conn = await connectToRouter();
    const chan = await conn.openChannel();

    const result = await chan.write("/ping", { address, count: 4 });
    await chan.close();
    await conn.close();

    res.status(200).json({ ping: result.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Test langsung di dependenciesnya
exports.depend = async (req, res) => {};
