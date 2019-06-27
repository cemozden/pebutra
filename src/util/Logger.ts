import { LoggerOptions, transports, createLogger } from "winston";
import { format } from "logform";

const logFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  );

const options : LoggerOptions = {
    level : 'info',
    format : logFormat, 
    transports : [
        new transports.File({
            filename : 'dist/logs/error.log', 
            level : 'error',
            maxsize : 20480
        }),
        new transports.File({
            filename : 'dist/logs/info.log', 
            level : 'info',
            maxsize : 20480,
        })
    ]
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== 'production') 
    logger.add(new transports.Console());


export {logger};