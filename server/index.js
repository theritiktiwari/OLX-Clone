const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

connectDB();
app.get("/", (req, res) => {
    res.send("OLX Clone REST API");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/listing", require("./routes/listing"));
app.use("/api/purchase", require("./routes/purchase"));

app.listen(port, () => {
    console.log(`Server running`);
});

module.exports = app;