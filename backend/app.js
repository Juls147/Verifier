require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyRoutes = require("./routes/verifyRoutes");
app.use("/api", verifyRoutes);

app.get("/", (req, res) => {
    res.send("BSrE Verification API Running...");
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});
