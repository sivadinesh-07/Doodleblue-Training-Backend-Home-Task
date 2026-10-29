const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
app.use(express.json());
app.use("/api/users", require("./routes/user.routes"));

app.get("/", (req, res) => {
    res.json({
        message: "DoodleBlue Backend Training API"
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const port = process.env.PORT || 5000;
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error({ message: err.message });
        process.exit(1);
    });