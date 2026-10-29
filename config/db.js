const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URL;

        if (!MONGO_URI) {
            throw new Error("MONGO_URL is missing in .env");
        }

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;