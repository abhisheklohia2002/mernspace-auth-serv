import winston from "winston";
import { Config } from "./index.js";
const logger = winston.createLogger({
  level: "debug",
  defaultMeta: {
    serviceName: "auth-service",
  },
  transports: [
    new winston.transports.File({
      level: "info",
      dirname: "logs",
      filename: "app-log",
      format: winston.format.json(),
      silent: Config.NODE_ENV === "development" ? true : false,
    }),
    new winston.transports.File({
      level: "error",
      dirname: "logs",
      filename: "error-log",
      format: winston.format.json(),
      silent: Config.NODE_ENV === "development" ? true : false,
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
      silent: Config.NODE_ENV === "development" ? true : false,
    }),
  ],
});

export default logger;
