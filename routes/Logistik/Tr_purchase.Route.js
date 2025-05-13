const express = require("express");
const multer = require("multer");

// Multer storage Purchase Payment
const storagePayment = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/wo_purchasing') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-PURCHASE-PAYMENT-' + file.originalname)
    }
});
// Multer storage Purchase Payment
const storageGR = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/wo_purchasing') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-GOOD-RECEIPT-' + file.originalname)
    }
});
// Multer storage Purchase Payment
const storageQA = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, '../uploads/') // Destinasi diluar project api & front-end
        cb(null, './images/wo_purchasing') // Destinasi didalam project front end
    },
    filename: function(req, file, cb) {
        // Rename the file to avoid conflicts
        cb(null, Date.now() + '-QUALITY-ASSURANCE-' + file.originalname)
    }
});

const uploadPayment = multer({ storage: storagePayment })
const uploadGR = multer({ storage: storageGR })
const uploadQA = multer({ storage: storageQA })

const router = express.Router();
const TrPurchase = require('../../controllers/Logistik/Tr_purchase.Controller.js');


// Purchase Order
router.get("/TrPo/getdata/:domain/:hierarchy/:deleted?/:status?", TrPurchase.getTrPo);
router.get("/TrPo/getdataEvident/:domain/:hierarchy/:deleted?/:type?/:status?", TrPurchase.getTrPoEvident);
router.get("/TrPo/getDataById/:id", TrPurchase.getTrPoById);
router.get("/TrPo/getDataByPO/:id", TrPurchase.getTrPoByPO);
router.get("/TrPo/getPoPrefix/:date", TrPurchase.getPoPrefix);
router.get("/TrPo/getdataForGR/:domain/:hierarchy/:deleted?/:status?", TrPurchase.getTrPoListForGr);

router.post("/TrPo/create", TrPurchase.createTrPo);

router.put("/TrPo/updatebyid/:id", TrPurchase.updateTrPo);
router.put("/TrPo/updatebyPO/:id", TrPurchase.updateTrPoByPO);

// Purchase Payment
router.get("/TrPp/getdata/:domain/:hierarchy/:deleted?/:status?", TrPurchase.getTrPp);
router.get("/TrPp/getdataAll/:deleted?/:status?", TrPurchase.getTrPpAll);
router.get("/TrPp/getDataById/:id", TrPurchase.getTrPpById);
router.get("/TrPp/getPpPrefix/:date", TrPurchase.getPpPrefix);
router.get("/TrPp/getPpPrefix/:date", TrPurchase.getPpPrefix);

router.post("/TrPp/create", TrPurchase.createTrPp);

router.put("/TrPp/updatebyid/:id", TrPurchase.updateTrPp);
router.put("/TrPp/updateWithImage/:id", uploadPayment.single('Tr_pp_image'), TrPurchase.updateTrPpWithImage)

// Good Receipt
router.get("/TrGr/getdata/:domain/:hierarchy/:deleted?/:status?/:qa?", TrPurchase.getTrGr);
router.get("/TrGr/getGrPrefix/:date", TrPurchase.getGrPrefix);
router.get("/TrGr/getDataById/:id", TrPurchase.getTrGrById);
router.get("/TrGr/getdataForQa/:domain/:hierarchy/:deleted?/:status?", TrPurchase.getTrGrListForQa);

router.post("/TrGr/create", TrPurchase.createTrGr);
router.post("/TrGr/createWithImage", uploadGR.single('Tr_gr_image'), TrPurchase.createTrGrWithImage)

router.put("/TrGr/updatebyid/:id", TrPurchase.updateTrGr);
router.put("/TrGr/updateWithImage/:id", uploadGR.single('Tr_gr_image'), TrPurchase.updateTrGrWithImage)
router.put("/TrGr/updatebyGR/:id", TrPurchase.updateTrGrByGR);

// Quality ASSURANCE
router.get("/TrQa/getdata/:domain/:hierarchy/:deleted?/:status?", TrPurchase.getTrQa);
router.get("/TrQa/getDataById/:id", TrPurchase.getTrQaById);
router.get("/TrQa/getQaPrefix/:date", TrPurchase.getQaPrefix);

router.post("/TrQa/create", TrPurchase.createTrQa);

module.exports = router;