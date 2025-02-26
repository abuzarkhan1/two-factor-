const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  logger.debug("Authorization Header:", authHeader);

  if (!authHeader) {
    logger.warn(`Access denied - No token provided: ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: "Access Denied. Token is not provided" });
  }

  const token = authHeader.split(" ")[1]; 
  
  if (!token) {
    logger.warn(`Access denied - Invalid token format: ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: "Access Denied. Token is not provided" });
  }

  try {
    const extractTokenInfo = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug("Decoded Token Info:", extractTokenInfo);

    req.userInfo = extractTokenInfo;
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;