import { LoggerOptions, transports, createLogger } from "winston";
import { format } from "logform";
import * as expressWinston from "express-winston";

const logFormat = format.combine(
    format.timestamp(),
    //format.align(),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
  );

const consoleLogFormat = format.combine(
    format.timestamp(),
    //format.align(),
    format.colorize(),
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

const expressWinstonOptions : LoggerOptions = {
    level : 'info',
    format : logFormat, 
    transports : [
        new transports.File({
            filename : 'dist/logs/express_error.log', 
            level : 'error',
            maxsize : 20480
        }),
        new transports.File({
            filename : 'dist/logs/express_info.log', 
            level : 'info',
            maxsize : 20480,
        })
    ]
};

const expressWinstonConsoleOptions : LoggerOptions = {
    level : 'info',
    format : consoleLogFormat,
    transports : [new transports.Console()]
};

const logger = createLogger(options);
const expressWinstonLogger = expressWinston.logger(expressWinstonOptions);
const expressWinstonConsoleLogger = expressWinston.logger(expressWinstonConsoleOptions);

if (process.env.NODE_ENV !== 'production') 
    logger.add(new transports.Console({ format : consoleLogFormat}));

export {logger, expressWinstonLogger, expressWinstonConsoleLogger};