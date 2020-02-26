import winston from "winston";
import AppConfig from "../config/AppConfig";

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: AppConfig.LOG_LEVEL
        }),
        new winston.transports.File({ filename: "debug.log", level: "debug" })
    ]
};

const logger = winston.createLogger(options);

// if (AppConfig.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
// }

const abs = winston.loggers.get("abs");
abs.info("DEFAULT?");
export default logger;
