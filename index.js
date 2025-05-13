    const express = require("express");
    const mongoose = require("mongoose");
    
    // Auth route 
    
    // Master 
    const Company = require("./routes/Umum/Company.Route.js");
    

    // Transaksi 
    const Tr_teknis = require("./routes/Teknis/Tr_teknis.Route.js");
    const Tr_purchase = require("./routes/Logistik/Tr_purchase.Route.js");

    // Stock
    const Stock = require("./routes/Logistik/Stocks.Route.js");

    // Tambahan
    const userInternal = require("./routes/Umum/UserInternal.Route.js");
    const userExternal = require("./routes/Umum/UserExternal.Route.js");
    const utilities = require("./routes/Umum/Utilities.Route.js");
    const Item = require("./routes/Umum/Item.Route.js");
    const Location = require("./routes/Umum/Location.Route.js");
    const Role = require("./routes/Umum/Role.Route.js");
    const Image = require("./routes/Umum/Image.Route.js");

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
    app.use("/api/Tr_purchase", Tr_purchase)

    // Stock
    app.use("/api/Stock", Stock)

    // Tambahan
    app.use("/api/userInternal", userInternal)
    app.use("/api/userExternal", userExternal)
    app.use("/api/utilities", utilities)
    app.use("/api/item", Item);
    app.use("/api/location", Location);
    app.use("/api/role", Role);
    app.use("/api/image", Image);


    app.get("/", (req, res) => {
        res.send("Hello from Node API Server Updated");
    });


    mongoose
        .connect(
            "mongodb://103.178.13.50:136/internal-amerta"
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