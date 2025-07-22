const express = require("express");
const mongoose = require("mongoose");

// Auth route

// Master
const Company = require("./routes/Umum/Company.Route.js");

// Koordinator
const Tr_task = require("./routes/Koordinator/Tr_Task.Route.js");
const Tr_ticket = require("./routes/Koordinator/Tr_Ticket.Route.js");
const Tr_crm = require("./routes/Pelayanan/Tr_Crm.Route.js");
const Tr_data_lead = require("./routes/Pelayanan/Data_Lead.Route.js");
// Transaksi
const Tr_teknis = require("./routes/Teknis/Tr_teknis.Route.js");
const Tr_purchase = require("./routes/Logistik/Tr_purchase.Route.js");
const Tr_rab = require("./routes/Logistik/Tr_rab.Route.js");

// Stock
const Stock = require("./routes/Logistik/Stocks.Route.js");

// Umum
const userInternal = require("./routes/Umum/UserInternal.Route.js");
const userExternal = require("./routes/Umum/UserExternal.Route.js");
const utilities = require("./routes/Umum/Utilities.Route.js");
const Item = require("./routes/Umum/Item.Route.js");
const Location = require("./routes/Umum/Location.Route.js");
const Role = require("./routes/Umum/Role.Route.js");
const Image = require("./routes/Umum/Image.Route.js");
const DataPelanggan = require("./routes/Umum/DataPelanggan.Route.js");
const DataDrafter = require("./routes/Umum/DataDrafter.Route.js");
const DataTipe = require("./routes/Umum/DataTipe.Route.js");
const Announcement = require("./routes/Umum/Announcement.Route.js");
const PortGateway = require("./routes/Umum/PortGateway.Route.js");
const Cronjob = require("./routes/cronjobroute/cronjob.Route.js");
const Distance = require("./routes/Umum/Distance.Route.js");
const DataTarget = require("./routes/Umum/Data_target.Route.js");

// Connect mikrotik
const Mikrotik = require("./routes/Mikrotik/Mikrotik.Route.js");

const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

// Auth Route

// routes
// CronJob
app.use("/api/cronjob", Cronjob);
// Master
app.use("/api/company", Company);

// Koordinator
app.use("/api/Tr_task", Tr_task);
app.use("/api/Tr_ticket", Tr_ticket);

// Pelayanan
app.use("/api/Tr_crm", Tr_crm);
app.use("/api/Data_lead", Tr_data_lead);

// Transaksi
app.use("/api/Tr_teknis", Tr_teknis);
app.use("/api/Tr_purchase", Tr_purchase);
app.use("/api/Tr_rab", Tr_rab);

// Stock
app.use("/api/Stock", Stock);

// Tambahan
app.use("/api/userInternal", userInternal);
app.use("/api/userExternal", userExternal);
app.use("/api/utilities", utilities);
app.use("/api/item", Item);
app.use("/api/location", Location);
app.use("/api/role", Role);
app.use("/api/image", Image);
app.use("/api/DataPelanggan", DataPelanggan);
app.use("/api/DataDrafter", DataDrafter);
app.use("/api/DataTipe", DataTipe);
app.use("/api/announcement", Announcement);
app.use("/api/portgateway", PortGateway);
app.use("/api/mikrotik", Mikrotik);
app.use("/api/jarak", Distance);
app.use("/api/DataTarget", DataTarget);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

app.get("/ping", (req, res) => {
  res.send({ message: "Y" });
});

mongoose
  .connect(
    "mongodb://103.178.13.50:136/internal-amerta"
    // "mongodb://103.178.13.50:236/internal-amerta"

    // "mongodb://localhost:27017/internal-amerta"
    // "mongodb://root:ServerAmerta2024@77.37.47.90:27017/dbAmerta"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(5202, () => {
      console.log("Server is running on port 5202");
    });
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });
