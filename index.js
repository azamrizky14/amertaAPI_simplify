    const express = require("express");
    const mongoose = require("mongoose");
    const Product = require("./models/product.model.js");
    const productRoute = require("./routes/product.route.js");
    // Auth route 
    const Auth_route = require("./routes/Auth.route.js");
    // Master 
    const Master_itemRoute = require("./routes/Master_item.route.js");
    const Master_list_itemRoute = require("./routes/Master_list_item.route.js");

    const Master_supplier = require("./routes/Master_supplier.route.js");
    const Master_harga_materialRoute = require("./routes/Master_harga_material.route.js");
    const Master_pengadaan_barang = require("./routes/Master_pengadaan_barang.route.js")
    const Master_pengguna = require("./routes/Master_pengguna.route.js");


    // Transaksi 
    const Tr_task = require("./routes/Tr_task.route.js")
    const Tr_logisticRoute = require("./routes/Tr_logistic.route.js");
    const Tr_logisticKeluarRoute = require("./routes/Tr_logistic_keluar.route.js");
    const Tr_qc = require("./routes/Tr_qc.route.js");
    const Tr_reinput = require("./routes/Tr_reinput.route.js")
    const Tr_pembayaran = require("./routes/Tr_pembayaran.route.js")
    const Tr_closing = require("./routes/Tr_closing.route.js")
    const Tr_teknis = require("./routes/Tr_teknis.route.js");

    // Tambahan
    const userInternal = require("./routes/userInternalRoutes.js");
    const utilities = require("./routes/utilitiesRoutes.js");
    const Item = require("./routes/itemRoutes.js");
    const Location = require("./routes/locationRoutes.js");
    const cors = require("cors")
    const path = require("path");


    const app = express();

    // middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors())
    app.use('/images', express.static(path.join(__dirname, 'images'))); 

    // Auth Route 
    app.use("/api/Auth", Auth_route);
    // routes
    app.use("/api/products", productRoute);
    // Master 
    app.use("/api/Master_item", Master_itemRoute);
    app.use("/api/Master_list_item", Master_list_itemRoute)
    app.use("/api/Master_supplier", Master_supplier)
    app.use("/api/Master_harga_material", Master_harga_materialRoute)
    app.use("/api/Master_pengadaan_barang", Master_pengadaan_barang)
    app.use("/api/Master_pengguna", Master_pengguna);


    // Transaksi 
    app.use("/api/Tr_task", Tr_task)
    app.use("/api/Tr_qc", Tr_qc)
    app.use("/api/Tr_logistic", Tr_logisticRoute)
    app.use("/api/Tr_logistic_keluar", Tr_logisticKeluarRoute)
    app.use("/api/Tr_reinput", Tr_reinput)
    app.use("/api/Tr_pembayaran", Tr_pembayaran)
    app.use("/api/Tr_closing", Tr_closing)
    app.use("/api/Tr_teknis", Tr_teknis)

    // Tambahan
    app.use("/api/userInternal", userInternal)
    app.use("/api/utilities", utilities)
    app.use("/api/item", Item);
    app.use("/api/location", Location);














    app.get("/", (req, res) => {
        res.send("Hello from Node API Server Updated");
    });


    mongoose
        .connect(
            "mongodb://127.0.0.1:27017/internal-amerta"
            // "mongodb://localhost:27017/internal-amerta"
            // "mongodb://root:ServerAmerta2024@77.37.47.90:27017/dbAmerta"
        )
        .then(() => {
            console.log("Connected to database!");
            app.listen(4000, () => {
                console.log("Server is running on port 4000");
            });
        })
        .catch((error) => {
            console.log("Connection failed!", error);
        });