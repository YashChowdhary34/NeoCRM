const winston = require("winston");
const { DailyRotateFile } = require("winston-daily-rotate-file");

const transport = new DailyRotateFile({
  filename: "logs/audit-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20w",
  maxFiles: "180d",
});

module.exports.createLogger = () => {
  winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      transport,
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });
};
