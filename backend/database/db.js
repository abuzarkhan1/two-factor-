const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("Database connected successfully");
    } catch (err) {
        logger.error("Database connection error:", err);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;