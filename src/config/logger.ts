import winston from "winston";
const logger = winston.createLogger({
  level: "debug",
  defaultMeta: {
    serviceName: "auth-service",
  },
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;
