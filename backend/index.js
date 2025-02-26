require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); 
const fs = require('fs');
const path = require('path');
const connectDB = require("./database/db");
const homeRoutes = require("./routes/home-route");
const userRoutes = require("./routes/user-routes");
const logger = require("./utils/logger");

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());

connectDB();

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} request received`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});