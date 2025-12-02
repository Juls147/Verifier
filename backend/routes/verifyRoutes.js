const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { verifyPDF } = require("../controllers/verifyController");

// Temporary upload folder
const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/verify", upload.single("pdf"), verifyPDF);

module.exports = router;
