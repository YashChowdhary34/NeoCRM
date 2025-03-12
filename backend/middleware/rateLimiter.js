require("dotenv").config();
const rateLimit = require("express-rate-limit");

module.exports.apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX,
  handler: (req, res) => {
    auditLogger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many requests, please try again later",
    });
  },
});
