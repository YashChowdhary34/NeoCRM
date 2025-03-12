const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const auditTransport = DailyRotateFile({
  filename: "logs/audit-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "180d",
});

module.exports = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [auditTransport],
});
