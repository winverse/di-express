import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

export class LoggerService {
  private get logger() {
    // Set log dir
    const logDir = "logs";
    const { combine, timestamp, printf } = winston.format;

    // Define log format
    const logFormat = printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    const logger = winston.createLogger({
      format: combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat,
      ),
      transports: [
        new winstonDaily({
          level: "info",
          datePattern: "YYYY-MM-DD",
          dirname: logDir + "/info",
          filename: `%DATE%.info.log`,
          maxFiles: 10,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "error",
          datePattern: "YYYY-MM-DD",
          dirname: logDir + "/error",
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          zippedArchive: true,
        }),
        new winstonDaily({
          level: "debug",
          datePattern: "YYYY-MM-DD",
          dirname: logDir + "/debug",
          filename: `%DATE%.debug.log`,
          maxFiles: 5,
          zippedArchive: true,
        }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      );
    }

    return logger;
  }

  error(message: unknown) {
    console.log(message);
    this.logger.error(message);
  }
  info(message: unknown) {
    this.logger.info(message);
  }
  debug(message: unknown) {
    this.logger.debug(message);
  }
}
