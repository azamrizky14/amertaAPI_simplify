    const express = require("express");
    const mongoose = require("mongoose");
    
    // Auth route 
    
    // Master 
    const Company = require("./routes/companyRoutes.js");

    // Transaksi 
    const Tr_teknis = require("./routes/Tr_teknis.route.js");
    const Tr_po = require("./routes/Tr_po.route.js");

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
    
    // routes
    
    // Master 
    app.use("/api/company", Company)


    // Transaksi 
    app.use("/api/Tr_teknis", Tr_teknis)
    app.use("/api/Tr_po", Tr_po)

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
            app.listen(5202, () => {
                console.log("Server is running on port 5202");
            });
        })
        .catch((error) => {
            console.log("Connection failed!", error);
        });